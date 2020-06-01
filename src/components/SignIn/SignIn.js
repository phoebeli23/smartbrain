import React from 'react';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: '',
            errorMsg: '',
        }
    }

    onEmailChange = (event) => {
        this.setState({ signInEmail: event.target.value });
    }

    onPasswordChange = (event) => {
        this.setState({ signInPassword: event.target.value });
    }

    onSubmitSignIn = () => {
        fetch('https://agile-harbor-24400.herokuapp.com/signIn', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            }),
        })
        .then(response => response.json())
        .then(user => {
            if(user.id){
              this.props.loadUser(user);
              this.props.onRouteChange('home');
            } else {
                this.setState({ errorMsg: 'Incorrect username/password' });
            }
          })
    }

    render() {
        return (
            <article className="br5 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f3 fw6 ph0 mh0">Sign In</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input 
                                    className="pa2 input-reset ba bg-transparent w-100" 
                                    type="email" 
                                    name="email-address" 
                                    id="email-address"
                                    onChange={this.onEmailChange}  
                                />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input onChange={this.onPasswordChange} className="b pa2 input-reset ba bg-transparent w-100" type="password" name="password" id="password" autoComplete="on" />
                            </div>
                        </fieldset>
                        <div className="">
                            <input  
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f dib" 
                                type="submit" 
                                value="Sign in" 
                                onClick={this.onSubmitSignIn}
                            />
                        </div>
                        <ErrorMessage msg={this.state.errorMsg}/>
                    </div>
                </main>
            </article>
        );
    }
}

export default SignIn;