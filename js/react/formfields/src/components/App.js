import React from 'react';
import WeekNumber from 'components/WeekNumber';
import FormFields from 'components/FormFields';

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
            changed: false,
            dynamicCount: 0,
        }
    }

    componentDidMount() {
        this.setState({
            dirty: this.refs.formfields.isDirty(),
            changed: this.refs.formfields.isChanged()
        });
    }

    render() {
        /*
                        <WeekNumber
                            fieldId="count"
                            label="Count"
                            default={[5, 10]}/>
        */
        var dynamic = [];
        for (let i = 0; i < this.state.dynamicCount; i++) {
            dynamic.push(
                <input
                    key={i}
                    fieldId={'dyn-att-' + i}
                    label={'Dynamic ' + i}
                    default={'value' + i} />
            );
        }

        return (
            <div>
                <form onSubmit={this._onSubmit.bind(this)}>
                    <FormFields ref="formfields" onChange={this.onFormChange}>
                        <input
                            fieldId="name"
                            label="First Name"
                            default="Rob"
                            validator={validate} />
                        <input
                            fieldId="surname"
                            label="Surname"
                            default="Ickes"
                            validator={validate} />
                        <select fieldId="age" label="Age" default="1">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                        {this.state.dynamicCount > 0 && <div>Dynamic section</div>}
                        {this.state.dynamicCount > 0 && <div>{dynamic}</div>}

                    </FormFields>
                    <button
                        disabled={this.state.dirty || !this.state.changed}
                        onClick={this.onSend}>
                            Send
                    </button>
                    <button
                        disabled={this.state.dirty || !this.state.changed}
                        onClick={this.onReset}>
                        Reset
                    </button>
                    <button
                        onClick={this.onModify}>
                        ModifyForm 
                    </button>

                    <p>Dirty: {this.state.dirty && 'yes' || 'no'}</p>
                    <p>Changed: {this.state.changed && 'yes' || 'no'}</p>
                    <p>Dynamic count: {this.state.dynamicCount}</p>
                    {this.state.dataLive && <div className="preformatted">{this.state.dataLive}</div>}
                    {this.state.dataSubmitted && <div className="preformatted">{this.state.dataSubmitted}</div>}
                </form>
            </div>
        )
    }
    /*
                        {this.state.dynamicCount > 0 &&  false &&
                            <input
                                id="dynamic attribute"
                                label="Dynamic attribute"
                                default="Dyn" />
                        }
    */ 
    onSend = (e) => {
        e.preventDefault();
        console.log('onSend');
    }

    onReset = (e) => {
        console.log('onReset');
        e.preventDefault();
        this.refs.formfields.reset();
    }

    onModify = (e) => {
        console.log('onModify');
        e.preventDefault();
        //this.refs.formfields.reset();
        this.setState({dynamicCount: this.state.dynamicCount + 1});
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
        console.log('_onSubmit');
        e.preventDefault()
        //console.log('form submit')
        this.setState({
            dataSubmitted: JSON.stringify(this.refs.form.getValues())
        })
    }
}
