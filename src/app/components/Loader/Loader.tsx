import React from 'react';

interface Props {
    waitingMessage?: string;
}

const Loader: React.FC<Props> = (props: Props) => {
    const { waitingMessage } = props;
    return (
        <div>
            <h1>Loading the app...</h1>
            <p>
                {waitingMessage && waitingMessage.length > 0 ? waitingMessage : 'Please wait while the logic is ready.'}
            </p>
        </div>
    );
};

export default Loader;
