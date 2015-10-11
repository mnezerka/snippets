import React from 'react';
import Input from 'components/Input';
import WeekNumber from 'components/WeekNumber';
import Form from 'components/Form';

function validate(value) {
    return value.length > 0
}

export default class App extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            dataLive: null,
            dataSubmitted: null,
            dirty: false,
            changed: false
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this._onSubmit.bind(this)}>
                    <Form ref="form" onChange={this.onFormChange}>
                        <input id="jmeno" label="Jmeno" default="Michal" validator={validate} />
                        <input id="prijmeni" label="Prijmeni" default="Nezerka" />
                        <Input id="titul" label="Titul" default="Title" />
                        <select id="age" label="Vek" default="1">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                        <WeekNumber id="pocet" label="Pocet" default={[5, 10]}/>
                    </Form>
                    <button>Odeslat</button>
                    <p>Dirty: {this.state.dirty && "yes" || "no"}</p>
                    <p>Changed: {this.state.changed && "yes" || "no"}</p>
                    {this.state.dataLive && <div className="preformatted">{this.state.dataLive}</div>}
                    {this.state.dataSubmitted && <div className="preformatted">{this.state.dataSubmitted}</div>}
                </form>
            </div>
        )
    }

    onFormChange = (data, changed, dirty) => {
        //console.log('FormChange', data, changed, dirty)
        this.setState({
            dataLive: JSON.stringify(data),
            changed,
            dirty
        })
    }

    _onSubmit(e) {
        e.preventDefault()
        //console.log('form submit')
        this.setState({
            dataSubmitted: JSON.stringify(this.refs.form.getValues())
        })
    }
}
