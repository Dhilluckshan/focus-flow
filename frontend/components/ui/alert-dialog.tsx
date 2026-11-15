'use client';
import * as Primitive from '@radix-ui/react-alert-dialog';
import * as React from 'react';
export const AlertDialog=Primitive.Root;export const AlertDialogTitle=Primitive.Title;export const AlertDialogDescription=Primitive.Description;
export function AlertDialogContent({children,...props}:React.ComponentProps<typeof Primitive.Content>){return <Primitive.Portal><Primitive.Overlay className="overlay"/><Primitive.Content className="dialog" {...props}>{children}</Primitive.Content></Primitive.Portal>;}
