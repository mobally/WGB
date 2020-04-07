import { PureComponent } from 'react';
import './BackToTop.style';

class BackToTop extends PureComponent {
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    render() {
        return (
            <button
              block="BackToTop"
              onClick={ this.scrollToTop }
            >
                <p block="BackToTop" elem="Text">Back to top</p>
                <div block="BackToTop" elem="IconContainer">
                    <svg
                      block="BackToTop"
                      elem="Icon"
                      version="1.1"
                      x="0px"
                      y="0px"
                      viewBox="0 0 477.175 477.175"
                    >
                        <g>
                            <path
                              d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225
                              c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"
                            />
                        </g>
                    </svg>
                </div>
            </button>
        );
    }
}

export default BackToTop;
