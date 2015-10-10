import React from 'react';
import SignupForm from 'components/SignupForm';

export default class App extends React.Component{
    render() {
        return (
            <div>
                <SignupForm onSignup={this._onSignup.bind(this)}/>
            </div>
        )
    }

    _onSignup(data) {
        console.log('on signup', data)
    }
}
