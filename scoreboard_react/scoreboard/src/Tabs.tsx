import React from 'react';
import Tabs from '@mui/material/Tabs';
import EinerList from './einer/einerList.tsx';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ZweierList from './zweier/zweierList.tsx';
import Config from './config/Config.tsx';


function TabPanel(props: { children?: React.ReactNode; value: number; index: number }) {
    const { children, value, index, ...other } = props;
    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
        >
        {value === index && <Box p={3}>{children}</Box>}
        </div>
  );
}

function TabList(){
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }

    return(
        <Box sx={{ width: '100%', marginTop: '65px' }}>
            <Tabs
                onChange={handleChange}
                value={value}
                aria-label="Tabs where each tab needs to be selected manually"
            >
                <Tab label="Einer" />
                <Tab label="Zweier" />
                <Tab label="Config" />
            </Tabs>
            <TabPanel value={value} index={0}>
                <EinerList />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ZweierList />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Config />
            </TabPanel>
        </Box>
    )
}

export default TabList;