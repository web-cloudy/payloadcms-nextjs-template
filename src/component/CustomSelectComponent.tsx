import React, { useEffect, useState } from 'react';
import { SelectInput, useField } from 'payload/components/forms';
import axios from 'axios';

type Props = {
    path: string
}

type Region = {
    countries: string[],
    states: string[],
    cities: string[],
}

export const CustomSelectComponent: React.FC<Props> = ({ path }) => {
    const { value, setValue } = useField<Region>({ path });
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>(value?.countries || []);
    const [selectedStates, setSelectedStates] = useState<string[]>(value?.states || []);
    const [selectedCities, setSelectedCities] = useState<string[]>(value?.cities || []);

    useEffect(() => {
        // Fetch token on component mount
        axios.get('https://www.universal-tutorial.com/api/getaccesstoken', {
            headers: {
                "Accept": "application/json",
                "api-token": "zP5Ppe5gw2NQCJLJ2qApmatDHXwJybJX2iimBSXgnWbL8aQn7t92BkejQKgXtnLiB6w",
                "user-email": "nativedev124@gmail.com"
            }
        }).then(response => {
            setAuthToken(response.data.auth_token);
        }).catch(error => {
            console.error("Error fetching auth token:", error);
        });
    }, []);
    
    useEffect(() => {
        if (authToken) {
            // Fetch countries when the auth token is available
            axios.get('https://www.universal-tutorial.com/api/countries/', {
                headers: { "Authorization": `Bearer ${authToken}` }
            }).then(response => {
                const respCountries = response.data.map((country) => ({
                    label: country.country_name,
                    value: country.country_name,
                }));
                setCountries(respCountries.sort((a, b) => a.label.localeCompare(b.label)));
            }).catch(error => {
                console.error("Error fetching countries:", error);
            });
        }
    }, [authToken]);

    useEffect(() => {
        setValue({ countries: selectedCountries, states: [], cities: [] });
    }, [selectedCountries]);

    useEffect(() => {
        setValue({ ...value, states: selectedStates, cities: [] });
    }, [selectedStates]);

    useEffect(() => {
        setValue({ ...value, cities: selectedCities });
    }, [selectedCities]);

    

    useEffect(() => {
        if (selectedCountries.length > 0 && authToken) {
            const fetchStates = async () => {
                try {
                    const statesArray: { label: string, value: string }[] = [];
                    for (const country of selectedCountries) {
                        const stateResponse = await axios.get(`https://www.universal-tutorial.com/api/states/${country}`, {
                            headers: { "Authorization": `Bearer ${authToken}` }
                        });
                        const respStates = stateResponse.data.map((state) => ({
                            label: state.state_name,
                            value: state.state_name,
                        }));
                        statesArray.push(...respStates);
                    }
                    setStates(statesArray.sort((a, b) => a.label.localeCompare(b.label)));
                } catch (error) {
                    console.error("Error fetching states:", error);
                }
            };

            fetchStates();
        }
    }, [selectedCountries, authToken]);

    useEffect(() => {
        if (selectedStates.length > 0 && authToken) {
            const fetchCities = async () => {
                try {
                    const citiesArray: { label: string, value: string }[] = [];
                    for (const state of selectedStates) {
                        const cityResponse = await axios.get(`https://www.universal-tutorial.com/api/cities/${state}`, {
                            headers: { "Authorization": `Bearer ${authToken}` }
                        });
                        const respCities = cityResponse.data.map((city) => ({
                            label: city.city_name,
                            value: city.city_name,
                        }));
                        citiesArray.push(...respCities);
                    }
                    setCities(citiesArray.sort((a, b) => a.label.localeCompare(b.label)));
                } catch (error) {
                    console.error("Error fetching cities:", error);
                }
            };

            fetchCities();
        }
    }, [selectedStates, authToken]);

    return (
        <div>
            <label className='field-label'>
                Custom Select - Countries
            </label>
            <SelectInput
                style={{ marginBottom: '20px' }}
                path={path}
                name={path}
                options={countries}
                value={value?.countries}
                hasMany
                onChange={(country) => {
                    let countryArray = Array.isArray(country) ? country : [country];
                    setSelectedCountries(countryArray.map(c => c.value));
                }}
            />
            {
                value?.countries && value?.countries.length > 0 && (
                    <div>
                        <label className='field-label'>
                            Custom Select - States
                        </label>
                        <SelectInput
                            style={{ marginBottom: '20px' }}
                            path={path}
                            name={path}
                            hasMany
                            options={states}
                            value={value?.states}
                            onChange={(state) => {
                                let stateArray = Array.isArray(state) ? state : [state];
                                setSelectedStates(stateArray.map(s => s.value));
                            }}
                        />
                    </div>
                )
            }
            {
                value?.countries && value?.countries?.length > 0 && value?.states && value?.states?.length > 0 && (
                    <div>
                        <label className='field-label'>
                            Custom Select - Cities
                        </label>
                        <SelectInput
                            path={path}
                            name={path}
                            options={cities}
                            value={value?.cities}
                            hasMany
                            onChange={(city) => {
                                let cityArray = Array.isArray(city) ? city : [city];
                                setSelectedCities(cityArray.map(e => e.value));
                            }}
                        />
                    </div>
                )
            }
        </div>
    )
};
