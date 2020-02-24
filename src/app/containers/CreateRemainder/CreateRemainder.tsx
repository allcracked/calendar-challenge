import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../store';

import { RemainderObject } from '../../store/Remainders/RemaindersInterfaces';

interface Props {
    remainderId?: string;
}

const CreateRemainder: React.FC<Props> = (props: Props) => {
    const { remainderId } = props;
    const remainders = useSelector((state: AppState) => state.remainders.remainders);

    useEffect(() => {
        if (remainderId) {
            console.log(remainders[remainderId]);
        }
    }, []);

    return (
        <div>
            <h1>New Remainder</h1>
            {remainderId ? (
                <p>
                    Editing remainder:&nbsp;
                    {remainderId}
                </p>
            ) : (
                <p>Creting a new one.</p>
            )}
        </div>
    );
};

export default CreateRemainder;
