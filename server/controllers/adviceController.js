const Advice = require('../models/Advice');
const Farm = require('../models/Farm');
const axios = require('axios');

// Helper: Fetch weather data
const fetchWeatherData = async (latitude, longitude) => {
  try {
    const response = await axios.get(process.env.WEATHER_API_URL + '/weather', {
      params: {
        lat: latitude,
        lon: longitude,
        appid: process.env.WEATHER_API_KEY,
        units: 'metric',
      },
    });

    const data = response.data;
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 10) / 10,
      description: data.weather[0].description,
      feelsLike: Math.round(data.main.feels_like),
      pressure: data.main.pressure,
      cloudiness: data.clouds.all,
      rainfall: data.rain?.['1h'] || 0,
    };
  } catch (error) {
    console.error('Weather API error:', error.response?.data || error.message);
    throw new Error('Failed to fetch weather data');
  }
};

// Helper: Generate AI advice using OpenRouter API
const generateAIAdvice = async (farmData, weatherData) => {
  try {
    const prompt = `You are an expert agricultural advisor. Provide COMPLETE and ACTIONABLE farming advice based on the farm and weather data below. Do not leave the advice incomplete.

FARM DATA:
- Farm Name: ${farmData.farmName}
- Crop: ${farmData.crop}
- Crop Stage: ${farmData.cropStage}
- Soil Type: ${farmData.soilType}
- Area: ${farmData.areaSqMeters} sq meters

CURRENT WEATHER:
- Temperature: ${weatherData.temperature}°C (Feels like: ${weatherData.feelsLike}°C)
- Humidity: ${weatherData.humidity}%
- Wind Speed: ${weatherData.windSpeed} m/s
- Condition: ${weatherData.description}
- Pressure: ${weatherData.pressure} hPa
- Cloud Coverage: ${weatherData.cloudiness}%
- Recent Rainfall: ${weatherData.rainfall} mm

PROVIDE COMPLETE ADVICE WITH THESE SECTIONS:
1. Current Conditions Assessment - What is happening now
2. Immediate Actions - What to do this week
3. Pest & Disease Alert - Watch for these
4. Irrigation Advice - Water management
5. Fertilizer Timing - Nutrition schedule
6. Additional Recommendations - Other important tips

Keep advice practical, simple, and in English suitable for farmers. Ensure EVERY section is complete and not truncated.`;

    console.log('🤖 Calling OpenRouter API...');
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/auto',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 3000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ OpenRouter API response received');
    console.log('Response status:', response.status);
    console.log('Choices:', response.data.choices?.length);
    console.log('Finish reason:', response.data.choices?.[0]?.finish_reason);
    
    const choice = response.data.choices[0];
    let advice = choice?.message?.content;
    
    // If content is empty but reasoning exists, use reasoning
    if (!advice || advice.trim() === '') {
      console.log('⚠️  Content is empty, checking for reasoning...');
      if (choice?.message?.reasoning) {
        advice = choice.message.reasoning;
        console.log('📝 Using reasoning field as advice');
      }
    }
    
    if (!advice) {
      console.error('❌ No content or reasoning in API response:', JSON.stringify(response.data, null, 2));
      throw new Error('No advice content received from OpenRouter API');
    }
    
    console.log('📝 Advice generated successfully (length: ' + advice.length + ' chars)');
    return advice;

  } catch (error) {
    console.error('❌ OpenRouter API error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
};

// Generate advice
exports.generateAdvice = async (req, res) => {
  try {
    const { farmId } = req.params;

    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    if (farm.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const weatherData = await fetchWeatherData(
      farm.location.latitude,
      farm.location.longitude
    );

    const aiAdvice = await generateAIAdvice(
      {
        farmName: farm.farmName,
        crop: farm.crop,
        cropStage: farm.cropStage,
        soilType: farm.soilType,
        areaSqMeters: farm.areaSqMeters,
      },
      weatherData
    );

    const advice = new Advice({
      userId: req.user.userId,
      farmId,
      farmData: {
        farmName: farm.farmName,
        crop: farm.crop,
        soilType: farm.soilType,
        cropStage: farm.cropStage,
      },
      weatherData,
      aiAdvice,
    });

    await advice.save();

    res.status(201).json({
      message: 'Advice generated successfully',
      advice: {
        id: advice._id,
        farmName: farm.farmName,
        crop: farm.crop,
        weatherData,
        aiAdvice,
        createdAt: advice.createdAt,
      },
    });
  } catch (error) {
    console.error('Generate advice error:', error);
    res.status(500).json({
      message: 'Failed to generate advice',
      error: error.message,
    });
  }
};

// Get advice history
exports.getAdviceHistory = async (req, res) => {
  try {
    const { farmId } = req.params;

    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    if (farm.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const advices = await Advice.find({ farmId }).sort({ createdAt: -1 });

    res.json(advices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all user advice
exports.getAllUserAdvice = async (req, res) => {
  try {
    const advices = await Advice.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(advices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};