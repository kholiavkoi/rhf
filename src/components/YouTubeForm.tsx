import { useForm, useFieldArray, FieldErrors } from 'react-hook-form'
import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";

type FormValues = {
    username: string
    email: string
    channel: string
    social: {
        twitter: string
        facebook: string
    }
    phoneNumbers: string[],
    phNumbers: {
        number: string
    }[]
    age: number,
    dob: Date
}

let renderCount = 0

export const YouTubeForm = () => {

        const form = useForm<FormValues>({
            defaultValues: {
                username: 'Batman',
                email: '',
                channel: '',
                social: {
                    twitter: '',
                    facebook: ''
                },
                phoneNumbers: ['', ''],
                phNumbers: [{ number: '' }],
                age: 0,
                dob: new Date()
            },
        })

        const { register, control, handleSubmit, formState, watch, getValues, setValue, reset } = form
        const { errors, isSubmitSuccessful } = formState


        const { fields, append, remove } = useFieldArray({
            name: 'phNumbers',
            control
        })

        const onSubmit = (data: FormValues) => {
            console.log('Form Submitted', data)
        }

        const handleGetValues = () => {
            console.log('Get values', getValues('social'))
        }

        const handleSetValue = () => {
            setValue('username', '', {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
            })
        }

        const onError = (errors: FieldErrors<FormValues>) => {
            console.log('Form Errors', errors)
        }


        useEffect(() => {
            const subscription = watch((value) => {
                console.log(value)
            })
            return () => subscription.unsubscribe()
        }, [watch])

        useEffect(() => {
            if (isSubmitSuccessful) {
                reset()
            }
        }, [isSubmitSuccessful, reset])

        renderCount++
        return (
            <div>
                <h1>YouTube Form {renderCount / 2}</h1>
                {/*<h2>Watched value: {JSON.stringify(watch)}</h2>*/}
                <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                    <div className='form-control'>
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" {...register('username', {
                            required: {
                                value: true,
                                message: 'Username is required'
                            }
                        })} />
                        <p className='error'>{errors.username?.message}</p>
                    </div>

                    <div className='form-control'>
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                message: 'Invalid email format'
                            },
                            validate: {
                                notAdmin: (fieldValue) => {
                                    return fieldValue !== 'admin@example.com' || 'Enter a different email address'
                                },
                                notBlackListed: (fieldValue) => {
                                    return !fieldValue.endsWith('baddomain.com') || 'This domain is not supported'
                                }
                            }
                        })} />
                        <p className='error'>{errors.email?.message}</p>
                    </div>

                    <div className='form-control'>
                        <label htmlFor="channel">Channel</label>
                        <input type="text" id="channel" {...register('channel')} />
                        <p className='error'>{errors.channel?.message}</p>
                    </div>

                    <div className='form-control'>
                        <label htmlFor="twitter">Twitter</label>
                        <input type="text" id="twitter" {...register('social.twitter', {
                            disabled: watch('channel') === '',
                            required: 'Enter twitter'
                        })} />
                    </div>

                    <div className='form-control'>
                        <label htmlFor="facebook">Facebook</label>
                        <input type="text" id="facebook" {...register('social.facebook')} />
                    </div>

                    <div className='form-control'>
                        <label htmlFor="primary-phone">Primary phone number</label>
                        <input type="text" id="primary-phone" {...register('phoneNumbers.0')} />
                    </div>

                    <div className='form-control'>
                        <label htmlFor="secondary-phone">Secondary phone number</label>
                        <input type="text" id="secondary-phone" {...register('phoneNumbers.1')} />
                    </div>

                    <div>
                        <label htmlFor="">List of phone numbers</label>
                        <div>
                            {fields.map((field, index) => {
                                return (
                                    <div className='form-control' key={field.id}>
                                        <input type="text"
                                               {...register(`phNumbers.${index}.number` as const)}
                                        />
                                        {index > 0 && (
                                            <button type='button' onClick={() => remove(index)}>Remove</button>
                                        )}
                                    </div>
                                )
                            })}
                            <button type='button' onClick={() => append({ number: '' })}>Add phone number</button>
                        </div>
                    </div>

                    <div className='form-control'>
                        <label htmlFor="age">Age</label>
                        <input type="number" id="age" {...register('age', {
                            valueAsNumber: true,
                            required: 'Age is required'
                        })} />
                        <p className='error'>{errors.age?.message}</p>
                    </div>

                    <div className='form-control'>
                        <label htmlFor="dob">Date of Birth</label>
                        <input type="date" id="dob" {...register('dob', {
                            valueAsDate: true,
                        })} />
                        <p className='error'>{errors.dob?.message}</p>
                    </div>

                    <button>Submit</button>
                    <button type='button' onClick={() => reset()}>Reset</button>
                    <button type='button' onClick={handleGetValues}>Get Values</button>
                    <button type='button' onClick={handleSetValue}>Set Value</button>
                </form>
                <DevTool control={control} />
            </div>
        );
    }
;