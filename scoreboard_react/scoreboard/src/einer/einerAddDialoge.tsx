import { Dialog, DialogTitle, DialogActions, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Einer } from '../models/einer.model';

type MyDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onItemAdded: () => void;
};



const EinerAddDialog = ({ open, setOpen, onItemAdded }: MyDialogProps) => {
    const [name, setName] = useState('');
    const [feuerwehr, setFeuerwehr] = useState('');
    const [startnummer, setStartnummer] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetch(import.meta.env.VITE_API_URL + '/einer', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                feuerwehr: feuerwehr,
                startnummer: startnummer,
                zeit: '00:00:000',
                fehlerpunkte: 0,
            }),
            headers: { 'Content-Type': 'application/json' },
        });
        onItemAdded();
        setOpen(false);
    };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Fahrer Hinzufügen</DialogTitle>
      <form onSubmit={handleSubmit}>
        <TextField
        label="Name"
        variant="filled"
        fullWidth
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        label="Feuerwehr"
        variant="filled"
        fullWidth
        required
        value={feuerwehr}
        onChange={(e) => setFeuerwehr(e.target.value)}
      />

      <TextField
        label="Startnummer"
        type="number"
        variant="filled"
        fullWidth
        required
        value={startnummer}
        onChange={(e) => setStartnummer(e.target.value)}
      />

      <DialogActions>
              <Button onClick={() => setOpen(false)}>Schließen</Button>
              <Button type="submit">Hinzufügen</Button>
            </DialogActions>
      </form>
    </Dialog>
  );
};

export default EinerAddDialog;