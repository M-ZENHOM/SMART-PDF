"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, ChevronUp, Loader2, RotateCw, Search } from 'lucide-react';
import React from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useResizeDetector } from 'react-resize-detector';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import PdfFullscreen from './PdfFullscreen';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface PdfRendererProps {
    url: string
}

function PdfRenderer({ url }: PdfRendererProps) {
    const [numPages, setNumPages] = React.useState<number>();
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const [scale, setScale] = React.useState<number>(1);
    const [rotation, setRotation] = React.useState<number>(0)
    const [renderedScale, setRenderedScale] = React.useState<number | null>(null)
    const isLoading = renderedScale !== scale

    const pageValdiator = z.object({
        page: z.string().refine((val) => Number(val) > 0 && Number(val) <= numPages!)
    })

    type PageNumber = z.infer<typeof pageValdiator>

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<PageNumber>({
        defaultValues: {
            page: "1"
        },
        resolver: zodResolver(pageValdiator)
    })

    const { width, ref } = useResizeDetector();

    const handlePageSubmit = ({ page }: PageNumber) => {
        setPageNumber(Number(page))
        setValue('page', String(page))
    }
    return (
        <div className='w-full bg-white rounded-md shadow flex flex-col items-center '>
            {/* pdf options */}
            <div className='w-full h-14 border-b border-zinc-200 flex items-center justify-between px-2'>
                <div className='w-full flex items-center justify-between gap-1.5'>
                    <div className='flex items-center justify-center space-x-3'>
                        <Button variant="ghost" aria-label='previos page' onClick={() => {
                            setPageNumber((prev) => prev - 1 > 1 ? prev - 1 : 1)
                            setValue('page', String(pageNumber - 1 > 1 ? pageNumber - 1 : 1))
                        }}>
                            <ChevronDown className='w-4 h-4' />
                        </Button>
                        <div className='flex items-center gap-1.5'>
                            <Input
                                {...register("page")}
                                className={cn('w-12 h-8', errors.page && "focus-visible:ring-red-500")}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSubmit(handlePageSubmit)()
                                    }
                                }}

                            />
                            <p className='text-sm text-zinc-700 space-x-1'>
                                <span>/</span>
                                <span>{numPages ?? "x"}</span>
                            </p>
                        </div>

                        <Button disabled={pageNumber === numPages || numPages === undefined} variant="ghost" aria-label='next page' onClick={() => {
                            setPageNumber((prev) => prev + 1 < numPages! ? prev + 1 : numPages!)
                            setValue('page', String(pageNumber + 1))
                        }}>
                            <ChevronUp className='w-4 h-4' />
                        </Button>
                    </div>
                    <div className='space-x-2'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className='gap-1.5'>
                                    <Search className='w-4 h-4' />
                                    {scale * 100}% <ChevronDown className='w-4 h-4' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onSelect={() => setScale(1)}>100%</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setScale(1.5)}>150%</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setScale(2)}>200%</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setScale(2.5)}>250%</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            onClick={() => setRotation((prev) => prev + 90)}
                            variant='ghost'
                            aria-label='rotate 90 degrees'>
                            <RotateCw className='h-4 w-4' />
                        </Button>

                        <PdfFullscreen fileUrl={url} />
                    </div>
                </div>
            </div>
            {/* pdf pages */}
            <div className='flex-1 w-full max-h-screen'>
                <SimpleBar
                    autoHide={false}
                    className='max-h-[calc(100vh-10rem)]'>
                    <div ref={ref}>
                        <Document
                            loading={
                                <div className='flex justify-center'>
                                    <Loader2 className='my-24 h-6 w-6 animate-spin' />
                                </div>
                            }
                            onLoadError={() => {
                                toast.error('Error loading PDF')
                            }}
                            onLoadSuccess={({ numPages }) =>
                                setNumPages(numPages)
                            }
                            file={url}
                            className='max-h-full'>
                            {isLoading && renderedScale ? (
                                <Page
                                    width={width ? width : 1}
                                    pageNumber={pageNumber}
                                    scale={scale}
                                    rotate={rotation}
                                    key={'@' + renderedScale}
                                />
                            ) : null}

                            <Page
                                className={cn(isLoading ? 'hidden' : '')}
                                width={width ? width : 1}
                                pageNumber={pageNumber}
                                scale={scale}
                                rotate={rotation}
                                key={'@' + scale}
                                loading={
                                    <div className='flex justify-center'>
                                        <Loader2 className='my-24 h-6 w-6 animate-spin' />
                                    </div>
                                }
                                onRenderSuccess={() =>
                                    setRenderedScale(scale)
                                }
                            />
                        </Document>
                    </div>
                </SimpleBar>
            </div>
        </div>
    )
}

export default PdfRenderer