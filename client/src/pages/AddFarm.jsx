import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/form.css';

const AddFarm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    farmName: '',
    crop: '',
    cropStage: '',
    soilType: '',
    areaSqMeters: '',
    city: '',
    state: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        farmName: formData.farmName,
        crop: formData.crop,
        cropStage: formData.cropStage,
        soilType: formData.soilType,
        areaSqMeters: parseFloat(formData.areaSqMeters) || 0,
        location: {
          city: formData.city,
          state: formData.state,
          latitude: 0,
          longitude: 0,
        },
      };

      await api.post('/farms', data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add farm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container-large">
        <div className="form-header-large">
          <h1>Register Your Farm</h1>
          <p>Add your farm details to get AI-powered farming advice</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="form-large">
          <div className="form-grid-2col">
            <div className="form-group-large">
              <label htmlFor="farmName">Farm Name <span className="required">*</span></label>
              <input
                type="text"
                id="farmName"
                name="farmName"
                value={formData.farmName}
                onChange={handleInputChange}
                required
                placeholder="e.g., Green Valley Farm"
                className="input-large"
              />
            </div>

            <div className="form-group-large">
              <label htmlFor="crop">Crop Type <span className="required">*</span></label>
              <input
                type="text"
                id="crop"
                name="crop"
                value={formData.crop}
                onChange={handleInputChange}
                required
                placeholder="e.g., Rice, Wheat, Cotton, Sugarcane, Maize, Soybean"
                className="input-large"
              />
            </div>

            <div className="form-group-large">
              <label htmlFor="cropStage">Crop Stage <span className="required">*</span></label>
              <select
                id="cropStage"
                name="cropStage"
                value={formData.cropStage}
                onChange={handleInputChange}
                required
                className="input-large"
              >
                <option value="">Select crop stage</option>
                <option value="Seedling">Seedling</option>
                <option value="Vegetative">Vegetative</option>
                <option value="Flowering">Flowering</option>
                <option value="Maturity">Maturity</option>
              </select>
            </div>

            <div className="form-group-large">
              <label htmlFor="soilType">Soil Type <span className="required">*</span></label>
              <select
                id="soilType"
                name="soilType"
                value={formData.soilType}
                onChange={handleInputChange}
                required
                className="input-large"
              >
                <option value="">Select soil type</option>
                <option value="Black Soil">Black Soil (Regur)</option>
                <option value="Red Soil">Red Soil</option>
                <option value="Alluvial Soil">Alluvial Soil</option>
                <option value="Laterite Soil">Laterite Soil</option>
                <option value="Desert Soil">Desert Soil</option>
                <option value="Mountain Soil">Mountain Soil</option>
                <option value="Clay Loam">Clay Loam</option>
                <option value="Sandy Loam">Sandy Loam</option>
              </select>
            </div>

            <div className="form-group-large">
              <label htmlFor="areaSqMeters">Farm Area (sq meters) <span className="required">*</span></label>
              <input
                type="number"
                id="areaSqMeters"
                name="areaSqMeters"
                value={formData.areaSqMeters}
                onChange={handleInputChange}
                required
                placeholder="e.g., 5000"
                step="1"
                className="input-large"
              />
            </div>

            <div className="form-group-large">
              <label htmlFor="city">City / Village <span className="required">*</span></label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                placeholder="e.g., Naragund"
                className="input-large"
              />
            </div>

            <div className="form-group-large">
              <label htmlFor="state">State <span className="required">*</span></label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                placeholder="e.g., Karnataka"
                className="input-large"
              />
            </div>
          </div>

          <div className="form-actions-large">
            <button type="submit" className="btn btn-primary-large" disabled={loading}>
              {loading ? 'Adding farm...' : 'Add Farm'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary-large"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFarm;
