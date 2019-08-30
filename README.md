# react-textscramble
npm package with react text scramble component (effect). Demo can be found at https://dagut.ru starting from 01.09.2019

```
npm install react-textscramble
```

### Props

```
  "phrases": PropTypes.arrayOf(PropTypes.string).isRequired,
  "reportProgress":PropTypes.func,
  "freezeDuration": PropTypes.number,
  "isInfiniteLoop": PropTypes.bool
```
  "phrases" - array of phrases that should be shown to the user
  
  "reportProgress" -function that will be called each time phrase was fully shown it has argument that shows in percent ([0,1]) what progress was made
  
  "freezeDuration" time that each phrase should be displayed after appearing, default value - 800
  
  "isInfiniteLoop" set this to true if you want this text to loop over all phrases again and again (infinitely). Default value: false

## Example with progress bar
```
import React, {Component} from 'react';
import TextScramble from 'react-textscramble'; 
import './MainScreen.css';

/**
 * This is main block that will be displayed in welcomepage component
 * It has nice text effect and more cool stuff will be added later
 *
 * @export
 * @class MainScreen
 * @extends {Component}
 */
export default class MainScreen extends Component {
  constructor() {
    super();

    this.state = {
      scrambleProgess: 0
    }

    this.skipScramble = this
      .skipScramble
      .bind(this);
  }

  skipScramble() {}

  render() {
    // phrases list and freeDuration for TextScramble. Defined here just for
    // visibility
    let phrases = ['Hi', 'How are you doing?', 'I am doing it!'];
    let freezeDuration = 1600;

    //and now we render :)
    return (
      <div className="MainScreen">
        {/*we only display scramble skip button while we show that scramble text*/
        this.state.scrambleProgess < 1 && <div className="top-right-text">
          <span className="TextScramble-progressbar">
            <span
              onClick={this.skipScramble}
              className="underline"
              style={{
              'width': `${Math.floor(this.state.scrambleProgess * 100)}%`
            }}></span>skip</span>
        </div>}
        <div className="scramble-container">
          <TextScramble
            phrases={phrases}
            freezeDuration={freezeDuration}
            reportProgress={(progress) => {
            this.setState({"scrambleProgess": progress})
          }}/>
        </div>
      </div>
    )
  }
}
```
and css
```
@import 'https://fonts.googleapis.com/css?family=Roboto+Mono:100';
.MainScreen {
  font-family: 'Roboto Mono', monospace;
  background: #212121;
  height: 100vh;
  width: 100%;
  position:relative;
  justify-content: center;
  align-items: center;
  display: flex;
}
.MainScreen .scramble-container {
    font-weight: 100;
    font-size: 28px;
    color: #fafafa;
    text-align: center;
}
.MainScreen .dud {
  color: #757575;
}

.top-right-text {
    position: absolute;
    top:10px;
    right:10px;
}

.TextScramble-progressbar {
    color:white;
    position:relative;
}

.TextScramble-progressbar .underline {
    position: absolute;
    bottom: 0; left: 0;
    width: 0px;
    height: 2px;
    background-color: white;
    transition-property: width;
    transition-duration:1s;
  }
```
