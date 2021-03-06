import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import Timer from './Timer';
import soundfile from '../assets/alert.mp3';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const fabButtonStyles = {
    height: '2.8rem',
    width: '2.8rem',
    minHeight: '2.8rem',
    fontWeight: '500',
    color: '#282c34'
}

const resetButtonStyle = {
    marginTop: '2rem',
    fontSize: '1.4rem'
}

let timer;
const alert = () => {
    const audio = new Audio(soundfile);
    audio.play();
}


class Panel extends Component {
    constructor(props) {
        super();
        this.state = {
            breakLength: 300,
            sessionLength: 1500,
            initialSessionLength: 25,
            initialBreakLength: 5,
            isTimerPlayed: false,
            timerState: 'Session'
        }
        this.toggleTimer = this.toggleTimer.bind(this);
        this.toggleSession = this.toggleSession.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
    }
    addMinute(prop) {
        if (prop === 'break') {
            this.setState({
                breakLength: (this.state.initialBreakLength) * 60 + 60,
                initialBreakLength: this.state.initialBreakLength + 1
            }, this.resetTimer)
        } else {
            this.setState({
                sessionLength: (this.state.initialSessionLength) * 60 + 60,
                initialSessionLength: this.state.initialSessionLength + 1
            }, this.resetTimer)
        }
    }

    subtractMinute(prop) {
        if (this.state.breakLength <= 0 && this.state.initialBreakLength <= 0 && prop === 'break') {
            this.setState({
                breakLength: 0,
                initialBreakLength: 0
            })
        } 
        else if (this.state.sessionLength <= 0 && this.state.initialSessionLength <= 0 && prop === 'session') {
            this.setState({
                sessionLength: 0,
                initialSessionLength: 0
            }, this.resetTimer)
        } else {
            if (prop === 'break') {
                this.setState({
                    breakLength: (this.state.initialBreakLength) * 60 - 60,
                    initialBreakLength: this.state.initialBreakLength -1
                }, this.resetTimer)
            } else {
                this.setState({
                    sessionLength: (this.state.initialSessionLength) * 60 - 60,
                    initialSessionLength: this.state.initialSessionLength - 1
                }, this.resetTimer)
            }
        }
    }

    toggleTimer(isTimerPlayed) {
        this.setState({
            isTimerPlayed: !isTimerPlayed
        })
    }

    playAlert() {
        if(this.state.sessionLength === 0 && this.state.timerState === 'Session') {
            alert();
        } else if (this.state.breakLength === 0 && this.state.timerState === 'Break') {
            alert();
        }
    }

    toggleSession() {
        if(this.state.isTimerPlayed === false) {
            timer = setInterval(() => {
                if (this.state.sessionLength > 0) {
                    this.setState({
                        sessionLength: this.state.sessionLength - 1,
                        timerState: 'Session'
                    }, this.playAlert)
                }
                else if (this.state.sessionLength <= 0 && this.state.breakLength > 0) {
                    this.setState({
                        breakLength: this.state.breakLength - 1,
                        timerState: 'Break'
                    }, this.playAlert)
                } else {
                    this.setState({
                        sessionLength: this.state.initialSessionLength * 60 ,
                        breakLength: this.state.initialBreakLength * 60,
                        timerState: 'Session'
                    }, this.playAlert)
                }
        }, 1000)
        } else {
            clearInterval(timer);
        }
    }

    resetTimer() {
        this.setState({
            isTimerPlayed: false,
            timerState: 'Session',
            sessionLength: this.state.initialSessionLength * 60,
            breakLength: this.state.initialBreakLength * 60
        })
        clearInterval(timer);
    }

    render() {
        return (
            <Grid container justify='center' className="a">
                <Grid container alignItems='center' className="panel">
                    <Grid item sm>
                        <Grid container direction='column'>
                            <Grid item sm style={{paddingBottom: '1rem'}}>Break Length</Grid>
                            <Grid item sm>
                                <Grid container>
                                    <Grid item sm><Fab style={fabButtonStyles} onClick={() => this.subtractMinute('break')}><RemoveIcon /></Fab></Grid>
                                    <Grid item sm>{this.state.initialBreakLength}</Grid>
                                    <Grid item sm><Fab style={fabButtonStyles} onClick={() => this.addMinute('break')}><AddIcon /></Fab></Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm >
                        <Timer toggleTimer={this.toggleTimer} sessionLength={this.state.sessionLength} breakLength={this.state.breakLength} isTimerPlayed={this.state.isTimerPlayed} timerState={this.state.timerState} toggleSession={this.toggleSession} toggleBreak={this.toggleBreak} initialSessionLength={this.state.initialSessionLength} initialBreakLength={this.state.initialBreakLength}/>
                    </Grid>
                    <Grid item sm>
                        <Grid container direction='column'>
                            <Grid item sm style={{paddingBottom: '1rem'}}>Session Length</Grid>
                            <Grid item sm>
                                <Grid container>
                                    <Grid item sm><Fab style={fabButtonStyles} onClick={() => this.subtractMinute('session')}><RemoveIcon /></Fab></Grid>
                                    <Grid item sm>{this.state.initialSessionLength}</Grid>
                                    <Grid item sm><Fab style={fabButtonStyles} onClick={() => this.addMinute('session')}><AddIcon /></Fab></Grid>
                                </Grid>   
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Button style={resetButtonStyle}variant="contained" size="medium" color="primary" onClick={this.resetTimer}>reset</Button> 
            </Grid>
        )
    }
}

export default Panel;