import React, {Component} from 'react';
import PropTypes from 'prop-types';

// creds for TextScrambleHelper to https://codepen.io/soulwire/pen/mErPAK demo
// can be found at https://dagut.ru (01.09.2019)\
/**
 * This class is used to create nasty scramble effect
 *
 * @class TextScramble
 * @extends {Component}
 */
class TextScramble extends Component {
  constructor() {
    super();
    this.scrambleRef = React.createRef();
  }

  componentWillUnmount() {
    this
      .fx
      .cancelablePromise
      .cancel();
  }

  //after component is mounted, we start our magic
  componentDidMount() {

    const el = this.scrambleRef.current;
    const fx = new TextScrambleHelper(el);
    this.fx = fx;

    let counter = 0;
    const next = () => {
      if (counter < this.props.phrases.length) {
        fx
          .setText(this.props.phrases[counter])
          .then(() => {
            this.props.reportProgress && !this.fx.hasCanceled_ && this
              .props
              .reportProgress(counter / this.props.phrases.length);
            setTimeout(next, this.props.freezeDuration);
          })
          .catch((e) => {
            if (e.isCanceled) {
              console.log('Component was unmounted, progress will not be reported');
            } else {
              console.log(e);
            }
          });
        counter++;
        if (this.props.isInfiniteLoop) {
          counter = counter % this.props.phrases.length
        }
      } else {
        this.props.reportProgress && !this.fx.hasCanceled_ && this
          .props
          .reportProgress(1);
      }
    };

    next();
  }

  render() {
    return (
      <div ref={this.scrambleRef}></div>
    );
  }
}

TextScramble.propTypes = {
  /**
   * array of phrases that should be shown to the user
   */
  "phrases": PropTypes
    .arrayOf(PropTypes.string)
    .isRequired,
  /**
   * function that will be called each time phrase was fully shown
   * it has argument that shows in percent ([0,1]) what progress was made
   */
  "reportProgress": PropTypes.func,
  /**
  * time that each phrase should be displayed after appearing.
  * Default value: 800
  */
  "freezeDuration": PropTypes.number,
  /**
   * set this to true if you want this text to loop over all phrases again and again (infinitely)
   * Default value: false
   */
  "isInfiniteLoop": PropTypes.bool
}
TextScramble.defaultProps = {
  freezeDuration: 800,
  isInfiniteLoop: false
}

/**
 *This class is used to make scramble effect and will be used by TextScramble component
 *
 * @class TextScrambleHelper
 */
class TextScrambleHelper {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this
      .update
      .bind(this);
    this.setText = this
      .setText
      .bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    // making acncellable promise so that in case component is unmounted, we will
    // stop going further
    this.cancelablePromise = makeCancelable(new Promise((resolve) => this.resolve = resolve));
    //this is just renaming for easier access to promise
    const promise = this.cancelablePromise.promise;
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this
        .queue
        .push({from, to, start, end});
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let {from, to, start, end, char} = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// this function is used to create cancellable promise that will be used in
// componentwillunmount
const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(val => hasCanceled_
      ? reject({isCanceled: true})
      : resolve(val), error => hasCanceled_
      ? reject({isCanceled: true})
      : reject(error));
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    }
  };
};

export default TextScramble;