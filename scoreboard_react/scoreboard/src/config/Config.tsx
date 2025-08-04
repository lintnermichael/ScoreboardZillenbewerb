import React, { useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { Config } from '../models/config.model';
import debounce from 'lodash.debounce';

function ConfigSite(){
    const [inputHomeFF, setInputHomeFF] = useState<Record<string, string>>({});
    const [configData, setConfigData] = useState<Config>();

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/config')
            .then(response => response.json())
            .then(data => {
                setConfigData(data);
                const initialHomeFF: Record<string, string> = {};

                console.log('Fetched config data:', data);

                if(data._id) {
                    initialHomeFF[data._id] = data.home_ff;
                }
               

                setInputHomeFF(initialHomeFF);
            })
            .catch(error => {
                console.error('API error:', error);
            });
    }, []);


    const fetchPdf = () => {
        fetch(import.meta.env.VITE_API_URL + '/download-pdf')
            .then(res => res.blob())
            .then(blob => {
            const url = window.URL.createObjectURL(blob);
            window.open(url);
            })
            .catch(console.error);
    };

    const clearDB = () => {
        fetch(import.meta.env.VITE_API_URL + '/clear-db', {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(data => {
                console.log('Database cleared:', data);
            })
            .catch(console.error);
    }

    const saveToDatabase = (einer: Config) => {
            console.log(JSON.stringify(einer));
            fetch(import.meta.env.VITE_API_URL + '/config/'+String(einer._id), {
                method: 'PUT',
                body: JSON.stringify({
                    home_ff: einer.home_ff,
                }),
                headers: { 'Content-Type': 'application/json' },
            }).finally(() => {
            });
        };

    const handleHomeFFChange = (item: Config, value: string) => {
        setInputHomeFF(prev => ({
            ...prev,
            [String(item._id)]: value
        }));
        debouncedSaveHomeFF(item, value);
    };

    const debouncedSaveHomeFF = useMemo(
            () => debounce((config: Config, home_ff: string) => {
                const updatedConfig = { ...config, home_ff: home_ff };
                saveToDatabase(updatedConfig);
            }, 500),
            []
        );

    return (
        <div>
            {(configData && configData._id && (
                <TextField
                    label="Heim Feuerwehr"
                    value={inputHomeFF[configData._id] || ''}
                    onChange={(e) => handleHomeFFChange(configData, e.target.value)} 
                />
            ))}
            
            <br />
            <br />
            <Button variant="contained" onClick={() => fetchPdf()}>Download PDF</Button>
            <br />
            <Button variant="contained" onClick={() => clearDB()}>Clear Database</Button>
        </div>

        
    );
}

export default ConfigSite;