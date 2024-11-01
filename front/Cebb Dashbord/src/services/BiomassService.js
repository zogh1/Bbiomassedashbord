import axios from "axios";

export const fetchBiomassData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/biomass");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching biomass data:", error);
    throw error;
  }
};

export const fetchBiomassDetails = async (location) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/biomass/types-by-location?location=${encodeURIComponent(location)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching biomass details:", error);
    throw error;
  }
};