import React, { useEffect, useMemo, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TextField, CircularProgress, colors } from '@mui/material';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Einer } from '../models/einer.model';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ButtonGroup from '@mui/material/ButtonGroup';
import debounce from 'lodash.debounce';

import AddIcon from '@mui/icons-material/Add';
import EinerAddDialog from './einerAddDialoge.tsx';

function EinerList() {
    const [einer, setEiner] = useState<Einer[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [inputTimes, setInputTimes] = useState<Record<string, string>>({});
    const [inputFehlerpunkte, setInputFehlerpunkte] = useState<Record<string, string>>({});
    const [savingStatus, setSavingStatus] = useState<Record<string, boolean>>({});
    const [fehlerpunkteError, setFehlerpunkteError] = useState<Record<string, boolean>>({});
    const [inputDisqualiviziert, setInputDisqualiviziert] = useState<Record<string, boolean>>({});
    const [fullTime, setFullTime] = useState<Record<string, string>>({});  

    const [openDialog, setOpenDialog] = useState(false);
    const [reload, setReload] = useState(false);


    const timeRegex = /^\d{2}:\d{2}:\d{3}$/;

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/einer')
            .then(response => response.json())
            .then(data => {
                setEiner(data);
                const initialTimes: Record<string, string> = {};
                const initialFehlerpunkte: Record<string, string> = {};
                const initialSavingStatus: Record<string, boolean> = {};
                const initialDisqualiviziert: Record<string, boolean> = {};
                const initialFullTime: Record<string, string> = {};

                data.forEach((e: Einer) => {
                initialTimes[e._id] = e.zeit || '';
                initialFehlerpunkte[e._id] = e.fehlerpunkte?.toString() || '0';
                initialDisqualiviziert[e._id] = e.disqualiviziert || false;
                initialSavingStatus[e._id] = false;
                initialFullTime[e._id] = millisecondsToTime(timeToMs(e.zeit, e.fehlerpunkte));
                });

                setInputDisqualiviziert(initialDisqualiviziert);
                setInputTimes(initialTimes);
                setInputFehlerpunkte(initialFehlerpunkte);
                setSavingStatus(initialSavingStatus);
                setFullTime(initialFullTime);
                setLoading(false);
            })
            .catch(error => {
                console.error('API error:', error);
                setLoading(false);
            });
    }, [reload]);

    const saveToDatabase = (einer: Einer) => {
        setSavingStatus(prev => ({ ...prev, [einer._id]: true }));
        console.log(JSON.stringify(einer));
        fetch(import.meta.env.VITE_API_URL + '/einer/'+einer._id, {
            method: 'PUT',
            body: JSON.stringify({
                name: einer.name,
                zeit: einer.zeit,
                fehlerpunkte: einer.fehlerpunkte,
                feuerwehr: einer.feuerwehr,
                disqualiviziert: einer.disqualiviziert,
                startnummer: einer.startnummer,
            }),
            headers: { 'Content-Type': 'application/json' },
        }).finally(() => {
            setSavingStatus(prev => ({ ...prev, [einer._id]: false }));
        });
    };

    const debouncedSaveDisqualiviziert = useMemo(
    () => debounce((einer: Einer, value: boolean) => {
        const updatedEiner = { ...einer, disqualiviziert: value };
        saveToDatabase(updatedEiner);
    }, 500),
    []
    );

    const handleDisqualiviziertChange = (einer: Einer, checked: boolean) => {
    setInputDisqualiviziert(prev => ({ ...prev, [einer._id]: checked }));
    debouncedSaveDisqualiviziert(einer, checked);
    };

    const debouncedSaveTime = useMemo(
        () => debounce((einer: Einer, time: string) => {
            const updatedEiner = { ...einer, zeit: time };
            saveToDatabase(updatedEiner);
        }, 500),
        []
    );

    const debouncedSaveFehlerpunkte = useMemo(
        () => debounce((einer: Einer, punkte: number) => {
            const updatedEiner = { ...einer, fehlerpunkte: punkte };
            saveToDatabase(updatedEiner);
        }, 500),
        []
    );

    const handleTimeChange = (einer: Einer, value: string) => {
        setInputTimes(prev => ({ ...prev, [einer._id]: value }));
        setFullTime(prev => ({ ...prev, [einer._id]: millisecondsToTime(timeToMs(value, einer.fehlerpunkte)) }));
        if (!timeRegex.test(value)) {
            setOpen(true);
            return;
        }
        debouncedSaveTime(einer, value);
    };

    const handleFehlerpunkteChange = (einer: Einer, value: string) => {
        setInputFehlerpunkte(prev => ({ ...prev, [einer._id]: value }));
        setFullTime(prev => ({ ...prev, [einer._id]: millisecondsToTime(timeToMs(inputTimes[einer._id] || '00:00:000', parseInt(value, 10))) }));
        const parsed = parseInt(value, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 30) {
            setFehlerpunkteError(prev => ({ ...prev, [einer._id]: false }));
            debouncedSaveFehlerpunkte(einer, parsed);
        } else {
            setFehlerpunkteError(prev => ({ ...prev, [einer._id]: true }));
        }
    };

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    if (loading) return <p>Loading...</p>;

    const triggerReload = () => setReload(prev => !prev);

    return (
        <>
            <Button variant="contained" startIcon={<AddIcon />}  onClick={() => setOpenDialog(true)}>Einer</Button>
            <EinerAddDialog open={openDialog} setOpen={setOpenDialog} onItemAdded={triggerReload}/>

            <br />
            <br />

            <ButtonGroup sx={{ marginTop: '0px' }} variant="contained" aria-label="Basic button group">
                <Button onClick={() => {setEiner(timeSort([...einer]))}}>Zeit</Button>
                <Button onClick={() => {setEiner(startNummerSort([...einer]))}}>Startnummer</Button>
            </ButtonGroup>
            {einer.map((item, index) => (
                <Accordion key={item._id}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${item._id}-content`}
                        id={`panel-${item._id}-header`}
                    >
                        <Typography component="span" sx={{color: inputDisqualiviziert[item._id] ? colors.red[500] : 'inherit'}}>
                            {inputDisqualiviziert[item._id] ? "DS - " : ""} {item.startnummer} - {item.name} {inputDisqualiviziert[item._id] ? "" : "- "+ fullTime[item._id]}
                            {savingStatus[item._id] && (
                                <CircularProgress size={16} style={{ marginLeft: 10 }} />
                            )}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            <strong>Feuerwehr:</strong> {item.feuerwehr}<br />
                            <strong>Startnummer:</strong> {item.startnummer}<br />

                            <FormControlLabel
                                control={
                                    <Switch
                                    checked={inputDisqualiviziert[item._id] || false}
                                    onChange={(e) => handleDisqualiviziertChange(item, e.target.checked)}
                                    color="primary"
                                    />
                                }
                                label="Disqualifiziert"
                            />

                            {!inputDisqualiviziert[item._id] && (
                                <>
                                <br />
                                <br />
                                <TextField
                                label="Zeit (hh:mm:SSS)"
                                variant="outlined"
                                fullWidth
                                value={inputTimes[item._id] || ''}
                                onChange={(e) => handleTimeChange(item, e.target.value)}
                            /><br /><br />
                            <TextField
                                label="Fehlerpunkte"
                                type="number"
                                fullWidth
                                value={inputFehlerpunkte[item._id] || ''}
                                onChange={(e) => handleFehlerpunkteChange(item, e.target.value)}
                                error={fehlerpunkteError[item._id]}
                                helperText={fehlerpunkteError[item._id] ? 'Bitte eine Zahl zwischen 0 und 30 eingeben' : ''}
                            />
                            </>
                            )}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Wrong time format! Please use HH:MM:SS.mmm"
                action={action}
            />
        </>
    );
}



function timeToMs(zeit: string, hasse:number): number {
    const [min, sec, ms] = zeit.split(':').map(Number);
    return (min * 60000) + (sec * 1000) + ms + (hasse * 1000); // Add hasse time in seconds converted to milliseconds
}

function millisecondsToTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;

  // Pad numbers with zeros if needed
  const minStr = String(minutes).padStart(2, '0');
  const secStr = String(seconds).padStart(2, '0');
  const msStr = String(milliseconds).padStart(3, '0');

  return `${minStr}:${secStr}:${msStr}`;
}


function timeSort(data: Einer[]): Einer[] {
    console.log("Sorting by time");
    const qualified = data.filter(item => !item.disqualiviziert);
    const disqualified = data.filter(item => item.disqualiviziert);

    // Sort only qualified by time
    qualified.sort((a, b) => timeToMs(a.zeit, a.fehlerpunkte) - timeToMs(b.zeit, b.fehlerpunkte));

    // Combine qualified + disqualified (disqualified order stays as is)
    return [...qualified, ...disqualified];
}

function startNummerSort(data: Einer[]): Einer[] {
    console.log("Sorting by startnummer");
    return data.sort((a, b) => Number.parseInt(a.startnummer) - Number.parseInt(b.startnummer));
}

export default EinerList;
