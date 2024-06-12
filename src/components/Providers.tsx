'use client'

import React, { PropsWithChildren } from 'react'
import { Authenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import config from '@/../amplify_outputs.json'

Amplify.configure(config, {ssr: true})

const Providers: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <Authenticator.Provider>{children}</Authenticator.Provider>
  )
}

export default Providers