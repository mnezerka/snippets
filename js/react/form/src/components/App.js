import React from 'react';
import Form from 'components/Form';

function validate(value) {
    return value.length > 0
}

export default class App extends React.Component{
    render() {
        return (
            <div>
                <Form onChange={this.onFormChange}>
                    <input id="jmeno" label="Jmeno" default="Michal" validator={validate} />
                    <input id="prijmeni" label="Prijmeni" default="Nezerka" />
                    <select id="age" label="Vek" default="1">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </Form>
            </div>
        )
    }

    onFormChange = (changed, dirty) => {
        console.log('FormChange', changed, dirty)
    }
}
