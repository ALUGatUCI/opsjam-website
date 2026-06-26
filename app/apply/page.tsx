'use client'

import './style.css'
import { useEffect, useRef, useState } from 'react'
import { COUNTRIES } from './countries'
import { NavBar } from '../../components/NavBar'
import { MailingList } from '../../components/MailingList'

const STORAGE_KEY = 'infrajam-application'

// Build the <option> list for the country dropdown from the COUNTRIES data.
function countryOptions() {
  return COUNTRIES.map((country) => (
    <option key={country} value={country}>
      {country}
    </option>
  ))
}

function PersonalInformation() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMesg, setErrorMesg] = useState<string | null>(null)

  // Restore any previously saved answers when the form first loads.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved || !formRef.current) return

    const data: Record<string, string | string[]> = JSON.parse(saved)
    for (const element of Array.from(formRef.current.elements)) {
      const field = element as HTMLInputElement | HTMLSelectElement
      const value = data[field.name]
      if (!field.name || value === undefined) continue

      if (field instanceof HTMLInputElement && field.type === 'checkbox') {
        field.checked = Array.isArray(value)
          ? value.includes(field.value)
          : value === field.value
      } else if (field.type !== 'file') {
        field.value = value as string
      }
    }
  }, [])

  // Save every field to localStorage on each change.
  function handleChange() {
    if (!formRef.current) return

    const data: Record<string, string | string[]> = {}
    for (const [key, value] of new FormData(formRef.current).entries()) {
      if (value instanceof File) continue // files can't live in localStorage
      const existing = data[key]
      if (existing === undefined) {
        data[key] = value
      } else {
        data[key] = Array.isArray(existing) ? [...existing, value] : [existing, value]
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  // Send everything (including the resume file) to the endpoint.
  async function handleSubmit() {
    if (!formRef.current) return
    if (!formRef.current.reportValidity()) return // run the HTML5 validation first

    try {
      const response = await fetch('/api/submit-app', {
        method: 'PUT',
        body: new FormData(formRef.current), // multipart/form-data, file included
      })

      if (response.ok) {
        localStorage.removeItem(STORAGE_KEY) // clear the saved draft
        setStatus('success')
      } else {
        const data = await response.json()
        setStatus('error')
        setErrorMesg(data.error)
      }
    } catch {
      setStatus('error') // network error / request never reached the server
      setErrorMesg('Could not reach the server. Please try again.')
    }
  }

  return (
    <>
      <form
        ref={formRef}
        onChange={handleChange}
        className="signupForm"
        action="/submit-data"
        method="POST"
        encType="multipart/form-data"
      >
        <label htmlFor="fullName">Full Name:</label>
        <input type="text" id="fullName" name="fullName" required />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
        <label htmlFor="phoneNumber">Phone:</label>
        <input type="tel" id="phoneNumber" name="phoneNumber" required />
        <label htmlFor="gender">Gender:</label>
        <select id="gender" name="gender">
          <option value="">Prefer not to say</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="nonbinary">Non-binary</option>
          <option value="other">Other</option>
        </select>
        <label htmlFor="school">School / University:</label>
        <input type="text" id="school" name="school" required />
        <label htmlFor="levelOfStudy">Level of Study:</label>
        <select id="levelOfStudy" name="levelOfStudy" required>
          <option value="">Select one</option>
          <option value="high-school">High School</option>
          <option value="undergraduate">Undergraduate</option>
          <option value="graduate">Graduate</option>
          <option value="other">Other</option>
        </select>
        <label htmlFor="major">Major / Field of Study:</label>
        <input type="text" id="major" name="major" />
        <label htmlFor="graduationYear">Expected Graduation Year:</label>
        <input
          type="number"
          id="graduationYear"
          name="graduationYear"
          min="2024"
          max="2035"
        />
        <label htmlFor="country">Country of Residence:</label>
        <select id="country" name="country" required defaultValue="">
          <option value="" disabled>Select one</option>
          {countryOptions()}
        </select>
        <label htmlFor="shirtSize">T-Shirt Size:</label>
        <select id="shirtSize" name="shirtSize">
          <option value="">Select one</option>
          <option value="xs">XS</option>
          <option value="s">S</option>
          <option value="m">M</option>
          <option value="l">L</option>
          <option value="xl">XL</option>
          <option value="xxl">XXL</option>
        </select>
        <label>Dietary Restrictions:</label>
        <div className="checkboxGroup">
          <label>
            <input type="checkbox" name="dietaryRestrictions" value="vegetarian" /> Vegetarian
          </label>
          <label>
            <input type="checkbox" name="dietaryRestrictions" value="vegan" /> Vegan
          </label>
          <label>
            <input type="checkbox" name="dietaryRestrictions" value="halal" /> Halal
          </label>
          <label>
            <input type="checkbox" name="dietaryRestrictions" value="kosher" /> Kosher
          </label>
          <label>
            <input type="checkbox" name="dietaryRestrictions" value="gluten-free" /> Gluten-Free
          </label>
          <label>
            <input type="checkbox" name="dietaryRestrictions" value="dairy-free" /> Dairy-Free
          </label>
          <label>
            <input type="checkbox" name="dietaryRestrictions" value="nut-allergy" /> Nut Allergy
          </label>
          <label>
            <input type="checkbox" name="dietaryRestrictions" value="other" /> Other
          </label>
        </div>
        <label htmlFor="resume">Resume:</label>
        <input
          type="file"
          id="resume"
          name="resume"
          accept=".pdf,.doc,.docx"
        />
        <label htmlFor="dateOfBirth">I am 18 years old or older:</label>
        <input type="checkbox" id="dateOfBirth" name="dateOfBirth" required />
      </form>
      <br/>
      <button type="button" className='submitButton' onClick={handleSubmit}>Submit</button>

      {status === 'success' && (
        <p className="statusBox statusSuccess">
          Thank you for applying to InfraJam! We&apos;ve received your application and
          will get back to you soon.
        </p>
      )}
      {status === 'error' && (
        <p className="statusBox statusError">
          Something went wrong submitting your application: {errorMesg}. Please try again.
        </p>
      )}
    </>
  )
}

export default function Apply() {
  if (process.env.NEXT_PUBLIC_ACCEPTING_APPS == '0') {
    return (
      <>
        <NavBar></NavBar>
        <h1>Application</h1>

        <p>
          Applications are not open at this time. Be the first to know when applications
          open by joining our mailing list!
        </p>

        <MailingList></MailingList>
      </>
    )
  } else {
    return (
      <>
        <NavBar></NavBar>
        <h1>Application</h1>

        <p>
          We are excited that you're interested in applying for InfraJam! With that said,
          please fill out the form below and we will review it and get back to you as soon
          as possible.
        </p>

        <PersonalInformation></PersonalInformation>
      </>
    )
  }
}