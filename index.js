const axios = require('axios');
const readline = require('readline-sync');

const GH_BASE_URL = 'https://graphhopper.com/api/1/route';
const GH_API_KEY = 'a41f9ab1-3d05-4056-bf7e-32d26328acdc';

const cities = {
    "Santiago": [-33.4489, -70.6693],
    "Ovalle": [-30.6016, -71.1991],
};

// Consumo de combustible en litros por kilómetro
const FUEL_CONSUMPTION_PER_KM = 0.06;

async function getDistanceAndDuration(from, to) {
    try {
        const response = await axios.get(GH_BASE_URL, {
            params: {
                point: [cities[from].join(','), cities[to].join(',')],
                vehicle: 'car',
                locale: 'es',
                calc_points: false,
                key: GH_API_KEY
            },
            paramsSerializer: params => {
                return Object.keys(params)
                    .map(key => {
                        if (Array.isArray(params[key])) {
                            return params[key].map(val => `${key}=${val}`).join('&');
                        }
                        return `${key}=${params[key]}`;
                    })
                    .join('&');
            }
        });

        const path = response.data.paths[0];
        const distance = path.distance / 1000; // Convertir a kilómetros
        const time = path.time; // Duración en milisegundos

        const hours = Math.floor(time / 3600000);
        const minutes = Math.floor((time % 3600000) / 60000);
        const seconds = Math.floor((time % 60000) / 1000);

        const fuelUsed = distance * FUEL_CONSUMPTION_PER_KM; // Calcular el combustible usado

        console.log(`La distancia entre ${from} y ${to} es: ${distance.toFixed(2)} km`);
        console.log(`La duración del viaje es: ${hours} horas, ${minutes} minutos y ${seconds} segundos`);
        console.log(`El combustible utilizado en el viaje es: ${fuelUsed.toFixed(2)} litros`);
    } catch (error) {
        console.error('Error al obtener la distancia y duración:', error.message);
    }
}

const fromCity = readline.question('Ingrese la ciudad de origen: ');
const toCity = readline.question('Ingrese la ciudad de destino: ');

if (cities[fromCity] && cities[toCity]) {
    getDistanceAndDuration(fromCity, toCity);
} else {
    console.log('Una o ambas ciudades no se encuentran en la lista de ciudades disponibles.');
}
