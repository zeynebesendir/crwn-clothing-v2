import { useState } from 'react';

import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';

import {
    createAuthUserWithEmailAndPassword,
    createUserDocumentFromAuth,
} from '../../utils/firebase/firebase.utils';

import './sign-up-form.styles.scss';

//Default values object
const defaultFormFields = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
};

const SignUpForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);

    //Destructure values to use
    const { displayName, email, password, confirmPassword } = formFields;

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    /*
        SUBMIT: 
        Async as we are using external service here
    
        1.Confirm If the password macches -If not exit
        2. Create the user with Password and Email createAuthUserWithEmailAndPassword
            -User already signed up
            //
            -User created with createUserDocumentFromAuth
        3.Create a user document with the returned value
        */
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert('passwords do not match');
            return;
        }

        try {
            const { user } = await createAuthUserWithEmailAndPassword(
                email,
                password
            );
            //Pass user and the displayName to fill the object
            await createUserDocumentFromAuth(user, { displayName });
            console.log(user);
            resetFormFields();
        } catch (error) {
            switch (error.code) {
                case ('auth/email-already-in-use'):
                    alert('Cannot create user, email already in use');
                    break;
                case ('auth/weak-password'):
                    alert(error);
                    break;
                default:
                    console.log('user creation encountered an error', error);
            }
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFields({ ...formFields, [name]: value });
    };

    return (
        <div className='sign-up-container'>
            <h2>Don't have an account?</h2>
            <span>Sign up with your email and password</span>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label='Display Name'
                    type='text'
                    required
                    onChange={handleChange}
                    name='displayName'
                    value={displayName}
                />

                <FormInput
                    label='Email'
                    type='email'
                    required
                    onChange={handleChange}
                    name='email'
                    value={email}
                />

                <FormInput
                    label='Password'
                    type='password'
                    required
                    onChange={handleChange}
                    name='password'
                    value={password}
                />

                <FormInput
                    label='Confirm Password'
                    type='password'
                    required
                    onChange={handleChange}
                    name='confirmPassword'
                    value={confirmPassword}
                />
                <Button type='submit'>Sign Up</Button>
            </form>
        </div>
    );
};

export default SignUpForm;