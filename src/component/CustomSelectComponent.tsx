import React, { useEffect, useState } from 'react';
import { SelectInput, useField } from 'payload/components/forms';
import axios from 'axios';

type Props = {
    path: string
}

type Region = {
    country: string,
    state: string,
    city: string
}

export const CustomSelectComponent: React.FC<Props> = ({ path }) => {
    const { value, setValue } = useField<Region>({ path });
    const [authToken, setAuthToken] = useState();
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');

    useEffect(() => {
        // Fetch countries on component mount
        axios.get('https://www.universal-tutorial.com/api/getaccesstoken', {
            headers: {
                "Accept": "application/json",
                "api-token": "zP5Ppe5gw2NQCJLJ2qApmatDHXwJybJX2iimBSXgnWbL8aQn7t92BkejQKgXtnLiB6w",
                "user-email": "nativedev124@gmail.com"
            }
        }).then(response => {
            const auth_token = response.data.auth_token;
            setAuthToken(auth_token);
            axios.get('https://www.universal-tutorial.com/api/countries/', {
                headers: { "Authorization": `Bearer ${auth_token}` }
            }).then(response => {
                const countries = response.data.map((country) => {
                    return {
                        label: country.country_name,
                        value: country.country_name,
                    };
                })

                setCountries(countries.sort(
                    (a, b) => a.label.localeCompare(b.label)
                ))
            });
        });
    }, []);

    useEffect(() => {
        if (value && value.country) {
            // Fetch states when a country is selected
            axios.get(`https://www.universal-tutorial.com/api/states/${value.country}`, {
                headers: { "Authorization": `Bearer ${authToken}` }
            }).then(response => {
                const states = response.data.map((state) => {
                    return {
                        label: state.state_name,
                        value: state.state_name,
                    };
                })

                setStates(states.sort(
                    (a, b) => a.label.localeCompare(b.label)
                ))
            }
            );
        }

    }, [value?.country]);

    useEffect(() => {
        if (value && value.state) {
            // Fetch cities when a state is selected
            axios.get(`https://www.universal-tutorial.com/api/cities/${value.state}`, {
                headers: { "Authorization": `Bearer ${authToken}` }
            }).then(response => {
                const cities = response.data.map((city) => {
                    return {
                        label: city.city_name,
                        value: city.city_name,
                    };
                })
                console.log(cities)

                setCities(cities.sort(
                    (a, b) => a.label.localeCompare(b.label)
                ))
            }
            );
        }

    }, [value?.state]);

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
                value={value?.country}
                onChange={(e) => setValue(
                    { country: e.value, state: null, city: null }
                )}
            />
            {
                value?.country && (
                    <div>
                        <label className='field-label'>
                            Custom Select - States
                        </label>
                        <SelectInput
                            style={{ marginBottom: '20px' }}
                            path={path}
                            name={path}
                            options={states}
                            value={value?.state}
                            onChange={(e) => setValue(
                                { ...value, state: e.value, city: null }
                            )}
                        />
                    </div>
                )
            }
            {
                value?.country && value?.state && (
                    <div>
                        <label className='field-label'>
                            Custom Select - Cities
                        </label>
                        <SelectInput
                            path={path}
                            name={path}
                            options={cities}
                            value={value?.city}
                            onChange={(e) => setValue(
                                { ...value, city: e.value }
                            )}
                        />
                    </div>
                )
            }
        </div>
    )
};