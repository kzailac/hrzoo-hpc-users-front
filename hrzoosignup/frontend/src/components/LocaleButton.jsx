import React from 'react';
import {
  Button,
} from 'reactstrap';


export const LanguageButtonLoginOfficial = ({locale, setLocale}) => {
  function alternateLocale() {
    if (locale === 'en')
      setLocale('hr')
    else
      setLocale('en')
  }

  return (
    <Button size="sm" color="light"
      onClick={ () => alternateLocale() } >
      <span className="fs-4 m-0 p-0">
        { locale === 'hr' && '🇭🇷'}
        { locale === 'en' && '🇬🇧'}
      </span>
      {' '}
      <span className="fs-5">
        { locale.toUpperCase() }
      </span>
    </Button>
  )
}


export const LanguageButtonNav = ({locale, setLocale}) => {
  function alternateLocale() {
    if (locale === 'en')
      setLocale('hr')
    else
      setLocale('en')
  }

  return (
    <Button size="sm" color="light"
      onClick={ () => alternateLocale() } >
      <span className="fs-7 m-0 p-0">
        { locale === 'hr' && '🇭🇷'}
        { locale === 'en' && '🇬🇧'}
      </span>
      <br/>
      { locale.toUpperCase() }
    </Button>
  )
}
