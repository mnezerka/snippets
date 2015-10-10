import React from 'react';
import forms from 'newforms';

var signupForm = forms.Form.extend({
    username: forms.CharField(),
    password: forms.CharField({widget: forms.PasswordInput}),
    confirmPassword: forms.CharField({widget: forms.PasswordInput}),
    acceptTerms: forms.BooleanField({required: true}),

    clean: function() {
      if (this.cleanedData.password &&
        this.cleanedData.confirmPassword &&
        this.cleanedData.password != this.cleanedData.confirmPassword) {
        throw forms.ValidationError('Passwords do not match.')
    }
}
})

export default class SignupForm extends React.Component{
    render() {
        return (
            <form onSubmit={this._onSubmit.bind(this)}>
                <forms.RenderForm form={signupForm} ref="signupForm" />
                <button>Sign Up</button>
            </form>
        )
    }

    _onSubmit(e) {
        e.preventDefault()
        var form = this.refs.signupForm.getForm()
        var isValid = form.validate()
        if (isValid) {
            this.props.onSignup(form.cleanedData)
        }
    }
}
