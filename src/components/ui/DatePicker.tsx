'use client';

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from './calendar';
import { cn } from '@/lib/utils/utils';
import { Input } from './input';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';

type Props = {
  className: string;
};

const DatePicker: React.FC<Props & ControllerRenderProps> = ({
  className,
  name,
  value,
}) => {
  const { setValue } = useFormContext();

  const handleManualDateChange = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    if (event.target.value) {
      const newValue = new Date(event.target.value);
      if (newValue instanceof Date && !isNaN(newValue.getTime())) {
        setValue(name, newValue);
      } else {
        setValue(name, undefined);
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={cn('flex relative items-center w-fit', className)}>
          <Input
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
            placeholder={value ? format(value, 'MM/dd/yyyy') : 'MM/dd/yyyy'}
            onBlur={handleManualDateChange}
          />
          <CalendarIcon className="h-4 w-4 absolute right-4" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          onSelect={(date) => setValue(name, date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
