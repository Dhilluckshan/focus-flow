// LLM: Accessible shadcn dialog primitives powered by Radix UI.
'use client';
import * as Primitive from '@radix-ui/react-dialog';
import * as React from 'react';
export const Dialog=Primitive.Root;export const DialogTitle=Primitive.Title;export const DialogDescription=Primitive.Description;
export function DialogContent({children,...props}:React.ComponentProps<typeof Primitive.Content>){return <Primitive.Portal><Primitive.Overlay className="overlay"/><Primitive.Content className="dialog" {...props}>{children}</Primitive.Content></Primitive.Portal>;}
