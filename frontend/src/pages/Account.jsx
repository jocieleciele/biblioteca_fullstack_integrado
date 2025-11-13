import React from 'react'
import UserArea from '../components/UserArea'


export default function Account({user}){
  if(!user) return <div className="max-w-md mx-auto p-6 bg-panel rounded-md">Você precisa entrar para ver sua conta.</div>
  return <UserArea userType={user.role} />
}
