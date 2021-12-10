import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
    Button
} from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';


const useStyles = makeStyles(({ palette, spacing }) =>
    createStyles({

        button: {
            background:'#fff',
            '& .MuiButton-label': {
                fontWeight: 400,
                color: '#555',
                fontSize: 14,
            },
            marginRight:spacing(8),
            width:88,
        },
        fabButton: {
            position: 'absolute',
            bottom: spacing(5),
            left: '50%',
            width:312,
            height:94,
            marginLeft:'-156px',
            background:'rgba(255,255,255,0.6)',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            borderRadius:4,
          },
    })
);

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props}/>;
});

const InspectReportBim = ({ open, setOpen }) => {
    const classes = useStyles();

    return (
        <Dialog fullScreen open={open} onClose={() => setOpen(false)} TransitionComponent={Transition}>
            <div style={{height:'100%',background:'rgba(0,0,0,0.3)',textAlign:'center'}}>
            BIM
            
                <div aria-label="add" className={classes.fabButton}>
                    <Button className={classes.button} onClick={() => setOpen(false)}>取消</Button>
                    <Button color="primary" variant="contained" style={{width:88}} onClick={() => setOpen(false)}>确认</Button>
                </div>
            </div>
        </Dialog>
    )
}
export default InspectReportBim;