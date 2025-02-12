import { url_api_prefix } from '../config/general';
import Cookies from 'universal-cookie';


export async function addInvite(data)
{
  let cookies = new Cookies()
  let error_msg = ''

  try {
    let response = await fetch(`${url_api_prefix}/api/v1/internal/invites/`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies.get('csrftoken'),
        'Referer': 'same-origin'
      },
      body: data && JSON.stringify(data)
    })

    if (response.ok)
      return await response.json()

    if (!response.ok) {
      try {
        let json = await response.json();
        error_msg = `${response.status} ${response.statusText} in POST: ${json?.status?.message}`
      }
      catch (err1) {
        error_msg = `${response.status} ${response.statusText} in POST`
      }

    }
  }
  catch (err) {
    error_msg = `${err} in POST`;
  }

  if (error_msg)
    throw new Error(`Error creating invite: ${error_msg}`)
}


export async function fetchMyInvites()
{
  let error_msg = ''

  try {
    let response = await fetch(`${url_api_prefix}/api/v1/internal/invites-sent/`)

    if (response.ok)
      return await response.json()

    if (!response.ok) {
      try {
        await response.json();
        error_msg = `${response.status} ${response.statusText} in GET`
      }
      catch (err1) {
        error_msg = `${response.status} ${response.statusText} in GET`
      }
    }

  }
  catch (err) {
    error_msg = `${err} in GET`;
  }

  if (error_msg)
    throw new Error(`Error fetching My Invites data: ${error_msg}`)
}


export async function fetchInvite(inviteKey)
{
  let error_msg = ''

  try {
    let response = await fetch(`${url_api_prefix}/api/v1/internal/invites/${inviteKey}`)

    if (response.ok)
      return await response.json()

    if (!response.ok) {
      try {
        await response.json();
        error_msg = `${response.status} ${response.statusText} in GET`
      }
      catch (err1) {
        error_msg = `${response.status} ${response.statusText} in GET`
      }
    }

  }
  catch (err) {
    error_msg = `${err} in GET`;
  }

  if (error_msg)
    throw new Error(`Error fetching Invite data: ${error_msg}`)
}
