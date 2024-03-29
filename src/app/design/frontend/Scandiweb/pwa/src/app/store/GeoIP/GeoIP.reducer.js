import { UPDATE_GEOLOCATION } from './GeoIP.action';

const initialState = {
    isLoading: false
};

const SocialLoginReducer = (state = initialState, action) => {
    const { type } = action;

    switch (type) {
    case UPDATE_GEOLOCATION:
        const { data } = action;

        return {
            ...state,
            ...data
        };
    default:
        return state;
    }
};

export default SocialLoginReducer;
