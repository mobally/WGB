import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MyAccountNewReturnCustomerTable from 'Component/MyAccountNewReturnCustomerTable';
import MyAccountNewReturnAddressTable from 'Component/MyAccountNewReturnAddressTable';
import MyAccountReturnDetailsItems from 'Component/MyAccountReturnDetailsItems';
import MyAccountReturnDetailsTracking from 'Component/MyAccountReturnDetailsTracking';
import ExpandableContent from 'Component/ExpandableContent';
import MyAccountReturnDetailsChat from 'Component/MyAccountReturnDetailsChat';
import MyAccountReturnDetailsRating from 'Component/MyAccountReturnDetailsRating';
import Html from 'Component/Html';
import media from 'Util/Media';

import './MyAccountReturnDetails.style';

const STATUS_STATE_CANCELED = 'Canceled';
const STATUS_STATE_PROCESSING = 'Processing';
const STATUS_STATE_MAP = {
    Processing: 1,
    Approved: 2,
    Delivered: 3,
    Completed: 4
}

const TEN_MEGABYTES_IN_BYTES = 10 * 1000 * 1000 * 1000;

export default class MyAccountReturnDetails extends PureComponent {
    static propTypes = {
        carriers: PropTypes.array.isRequired,
        details: PropTypes.object.isRequired,
        handleCancelRMA: PropTypes.func.isRequired,
        isCancelDisabled: PropTypes.bool.isRequired,
        renderPageTitle: PropTypes.func.isRequired,
        max_file_size: PropTypes.number
    };

    static defaultProps = {
        max_file_size: TEN_MEGABYTES_IN_BYTES
    };

    state = {
        isHowItWorksBlockExpanded: true
    };

    handleCancelRMA = () => {
        const { handleCancelRMA, isCancelDisabled } = this.props;

        if (isCancelDisabled) return;

        handleCancelRMA();
    };

    toggleExpandableContent = () => {
        const { isHowItWorksBlockExpanded } = this.state;

        this.setState({ isHowItWorksBlockExpanded: !isHowItWorksBlockExpanded });
    };

    renderHowItWorksBlock() {
        const { details: { status_description = '' } } = this.props;
        const { isHowItWorksBlockExpanded } = this.state;

        const htmlContent = status_description.replace(
            /\{{media url=&quot;(.*?)\&quot;}}/g,
            value => media(value.match('url=&quot;(.*)&quot;')[1])
        );

        return (
            <ExpandableContent
              heading={ __('Returns: how it works') }
              isContentExpanded={ isHowItWorksBlockExpanded }
              onClick={ this.toggleExpandableContent }
              mix={ {
                  block: 'MyAccountReturnDetails',
                  elem: 'HowItWorksBlock'
              } }
            >
                <div
                  block="MyAccountReturnDetails"
                  elem="HowItWorksDescription"
                >
                    { status_description
                        ? <Html content={ htmlContent } />
                        : <span>No description</span> }
                </div>
            </ExpandableContent>
        );
    }

    renderProgressItem(name, itemIndex, state) {
        const index = itemIndex + 1;
        const activeIndex = STATUS_STATE_MAP[state];

        const isLastActive = activeIndex === index;
        const mods = { isActive: index <= activeIndex, isLastActive };

        return (
            <div
              block="MyAccountReturnDetails"
              elem="ProgressItem"
              mods={ mods }
              key={ itemIndex }
            >
                <div
                  block="MyAccountReturnDetails"
                  elem="ProgressContent"
                >
                    <span
                      block="MyAccountReturnDetails"
                      elem="ProgressCircle"
                      mods={ mods }
                    >
                        { isLastActive && index }
                    </span>
                    <span
                      block="MyAccountReturnDetails"
                      elem="ProgressName"
                      mods={ { isLastActive } }
                    >
                        { name }
                    </span>
                </div>
            </div>

        );
    }

    renderProgressBar() {
        const { details: { state } } = this.props;

        if (state === STATUS_STATE_CANCELED) return null;

        return (
            <div
              block="MyAccountReturnDetails"
              elem="ProgressBar"
            >
                { [
                    '1. Processing',
                    '2. Approved',
                    '3. Delivered',
                    '4. Completed'
                ].map((item, index) => this.renderProgressItem(item, index, state)) }
            </div>
        );
    }

    renderCalcelRMATitle() {
        return (
            <span
              block="MyAccountReturnDetails"
              elem="CancelRMATitle"
            >
                CANCELED
            </span>
        );
    }

    renderCalcelRMAButton() {
        const { isCancelDisabled, details: { state } } = this.props;

        if (state === STATUS_STATE_CANCELED) return this.renderCalcelRMATitle();

        if (state !== STATUS_STATE_PROCESSING) return null;

        return (
            <button
              block="Button"
              mods={ { isHollow: true } }
              disabled={ isCancelDisabled }
              mix={ {
                  block: 'MyAccountReturnDetails',
                  elem: 'CancelRMAButton'
              } }
              onClick={ this.handleCancelRMA }
            >
                { __('CANCEL RMA') }
            </button>
        );
    }

    renderRatingSelect() {
        const { details: { id: request_id, rating, state }, customer_feedback_enabled } = this.props;

        if (!customer_feedback_enabled || state !== 'Completed' || rating.stars !== 0) {
            return null;
        }

        return (
            <MyAccountReturnDetailsRating
              request_id={ request_id }
              rating={ rating }
            />
        );
    }

    render() {
        const {
            details,
            carriers,
            details: {
                items = [],
                id = ''
            },
            renderPageTitle,
            max_file_size,
            chat_enabled
        } = this.props;

        return (
            <div block="MyAccountReturnDetails">
                { renderPageTitle(id) }
                { this.renderProgressBar() }
                { this.renderRatingSelect() }
                <div
                  block="MyAccountReturnDetails"
                  elem="CustomerAndAddressBlocks"
                >
                    <MyAccountNewReturnCustomerTable />
                    <MyAccountNewReturnAddressTable />
                </div>
                { this.renderHowItWorksBlock() }
                <MyAccountReturnDetailsItems
                  items={ items }
                />
                <MyAccountReturnDetailsTracking
                  carriers={ carriers }
                  details={ details }
                />
                { (() => {
                    if (!chat_enabled) {
                        return null;
                    }
                    return (
                        <MyAccountReturnDetailsChat
                          max_file_size={ max_file_size }
                          requestId={ details.id }
                        />
                    );
                })() }
                { this.renderCalcelRMAButton() }
            </div>
        );
    }
}
