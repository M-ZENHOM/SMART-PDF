"use client"
import React, { useContext } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'
import { ChatContext } from './ChatContext'

function ChatInput({ isDisabled }: { isDisabled?: boolean }) {
    const { addMessage, handleInputChange, message, isLoading } = useContext(ChatContext)

    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    return (
        <div className='aboslute bottom-0 left-0 w-full'>
            <form className='flex flex-row mx-2 gap-3'>
                <div className='relative flex h-full flex-1 items-stretch md:flex-col p-4'>
                    <Textarea
                        ref={textareaRef}
                        rows={1}
                        maxRows={4}
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && message.trim() !== '') {
                                e.preventDefault()
                                addMessage()
                                textareaRef.current?.focus()
                            }
                        }}
                        className='resize-none text-base pr-12 py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2'
                        placeholder='Enter your question to your smart friend....' />
                    <Button
                        className='absolute right-8 top-[50%] translate-y-[-50%]'
                        disabled={isLoading || message.trim() === '' || isDisabled}
                        type='submit'
                        aria-label='send message'
                        onClick={() => {
                            addMessage()
                            textareaRef.current?.focus()
                        }}
                    >
                        <Send className='w-4 h-4' />
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ChatInput