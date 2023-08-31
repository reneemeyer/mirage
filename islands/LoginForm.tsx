import type { Signal } from "@preact/signals";
import {useState} from "https://esm.sh/stable/preact@10.15.1/denonext/hooks.js";

interface LoginFormProps {
  isNewUser?: boolean;
}

interface FormValues {
  firstName?: string;
  lastName?: string;
  userName?: string;
  password: string;
  email: string;
  confirmPassword?: string;
}

enum FormFields {
  firstName=  'firstName',
  lastName = 'lastName',
  userName = 'userName',
  password = 'password',
  email = 'email',
  confirmPassword = 'confirmPassword',
}

const INIT_VALUES = {
  [FormFields.firstName]: '',
  [FormFields.lastName]: '',
  [FormFields.userName]: '',
  [FormFields.password]: '',
  [FormFields.email]: '',
  [FormFields.confirmPassword]: '',
}

export default function LoginForm({isNewUser = true}: LoginFormProps) {
  const [formValues, setFormValues] = useState<FormValues>(INIT_VALUES);
  const [formError, setFormError] = useState<string[] | null>(null);
  const {
    firstName,
    lastName,
    userName,
    password,
    email,
    confirmPassword,
  } = formValues;

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    const newFormValues = {
      ...formValues,
      [name]: value
    }
    setFormValues(newFormValues);
    if (name.includes('password')) {
      setFormError('');
    }

  }

  const nameFields = (() => {
    if (!isNewUser) return null;
    return (
      <div>
        <input
          onChange={handleChange}
          type="text"
          name={FormFields.firstName}
          placeholder="first name"
          value={firstName}
          required
        />
        <input
          onChange={handleChange}
          type="text"
          name={FormFields.lastName}
          placeholder="last name"
          value={lastName}
          required
        />
        <input
          type="text"
          name={FormFields.userName}
          placeholder="user name"
          onChange={handleChange}
          value={userName}
          required
        />
      </div>
    )
  })();

  const passwordConfirm = (() => {
    if (!isNewUser) return null;
    return (
      <input
        type="password"
        name={FormFields.confirmPassword}
        placeholder="confirm password"
        value={confirmPassword}
        onChange={handleChange}
        required
      />
    )
  })();

  const getFormErrors = () => {
    const formErrors = [];
    console.log("🌸 in here")
    if (isNewUser) {
      console.log(confirmPassword, password, "PASSWORD CHECK")
      if (confirmPassword !== password) {
        formErrors.push('passwords must match')
      }
    }
    return formErrors
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = getFormErrors();
    if (formErrors.length) {
      setFormError(formErrors);
      return;
    }
    const body = JSON.stringify({
      user: {
        username: userName,
        first_name: firstName,
        last_name: lastName,
        password: password,
        email,
      }
    })
    try {
      const resp = await fetch('http://127.0.0.1:3000/signup', {method: 'Post', body})
      if (!resp.ok) {
        conosole.log('uh oh err')
      }
      console.log(resp)
    } catch (e) {
      console.log(e, "error signing up")
    }

    return;
  }


  return (
    <form className="flex flex-col" onsubmit={handleSubmit}>
      {nameFields}
      <input
        type="email"
        name={FormFields.email}
        placeholder="email"
        value={email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name={FormFields.password}
        placeholder="password"
        value={password}
        onChange={handleChange}
        required
      />
      {passwordConfirm}
      {formError ? <p>passwords must match</p> : null}
      <button type="submit">
        submit
      </button>
    </form>
  );
}
