import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './MyAccountReturnDetailsChatMessages.style';

export default class MyAccountReturnDetailsChatMessages extends PureComponent {
    static propTypes = {
        chatMessages: PropTypes.array.isRequired
    };

    converDateToTwoDigits(value) {
        if (value < 10) return `0${value}`;

        return value;
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        const objDiv = document.getElementById('MyAccountReturnDetailsChatMessages-ChatWrapper');

        objDiv.scrollTop = objDiv.scrollHeight;
    }

    getDateTime(created_at) {
        const [date, time] = created_at.split(' ');
        const [year, month, day] = date.split('-');
        const [hours, minutes] = time.split(':');

        const formattedDate = `${day}.${month}.${year}`;
        const formattedTime = `${hours}:${minutes}`;

        return `${formattedDate} ${formattedTime}`;
    }

    renderFile = ({ filename, link }, index) => {
        return (
            <span
              key={ index }
              block="MyAccountReturnDetailsChatMessages"
              elem="FileName"
            >
                <a href={ link }>
                    { filename }
                </a>
            </span>
        )
    }

    renderFileList(files) {
        if (!files.length) return <div />;

        return (
            <div
              block="MyAccountReturnDetailsChatMessages"
              elem="FileListWrapper"
            >
                { files.map(this.renderFile) }
            </div>
        )
    }

    renderAdditionalContent(created_at, files) {
        const dateTime = this.getDateTime(created_at);

        return (
            <div
              block="MyAccountReturnDetailsChatMessages"
              elem="AdditionalContentWrapper"
            >
                { this.renderFileList(files) }
                <span
                  block="MyAccountReturnDetailsChatMessages"
                  elem="AdditionalContentDateWrapper"
                >
                    <span
                      block="MyAccountReturnDetailsChatMessages"
                      elem="AdditionalContentDatePlaceholder"
                    >
                        { dateTime }
                    </span>
                    <span
                      block="MyAccountReturnDetailsChatMessages"
                      elem="AdditionalContentDate"
                    >
                        { dateTime }
                    </span>
                </span>
            </div>
        );
    }

    renderTextBlockUsername(username, index, isRightSide) {
        const { chatMessages } = this.props;
        const isUsernameRenderNeeded = index === 0 || chatMessages[index - 1].username !== username;

        if (!isUsernameRenderNeeded) return null;

        return (
            <span
              block="MyAccountReturnDetailsChatMessages"
              elem="TextBlockMessengerName"
              mods={ { isRightSide } }
            >
                { username }
            </span>
        )
    }

    renderTextBlock = (messageData, index) => {
        const {
            is_manager,
            created_at,
            message,
            username,
            files
        } = messageData;

        const isRightSide = !is_manager;

        return (
            <div
              key={ index }
              block="MyAccountReturnDetailsChatMessages"
              elem="TextBlockWrapper"
              mods={ { isRightSide } }
            >
                { this.renderTextBlockUsername(username, index, isRightSide) }
                <div
                  block="MyAccountReturnDetailsChatMessages"
                  elem="TextBlockMessageWrapper"
                  mods={ { isRightSide } }
                >
                    { message && (
                        <p
                        block="MyAccountReturnDetailsChatMessages"
                        elem="TextBlockMessage"
                        >
                            { message }
                        </p>
                    ) }
                    { this.renderAdditionalContent(created_at, files) }
                </div>
            </div>
        );
    }

    render() {
        const { chatMessages } = this.props;

        return (
            <div
              id="MyAccountReturnDetailsChatMessages-ChatWrapper"
              block="MyAccountReturnDetailsChatMessages"
              elem="ChatWrapper"
            >
                { chatMessages.length
                    ? chatMessages.map(this.renderTextBlock)
                    : <span>No messages</span> }
            </div>
        );
    }
}