import { AbstractControl, ValidatorFn } from '@angular/forms';

export function meetingValidator(): ValidatorFn {
  return (
    form: AbstractControl,
  ): { [key: string]: { value: string } } | null => {
    const date = new Date(form.value.date);
    const now = new Date(Date.now());

    const [time, modifier] = form.value.time.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    const adjustedHours =
      modifier === 'PM' && hours < 12
        ? hours + 12
        : modifier === 'AM' && hours === 12
          ? 0
          : hours;

    date.setHours(adjustedHours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    if (date.getTime() >= now.getTime()) {
      return null;
    } else {
      return { invalidMeetingDate: { value: date.toString() } };
    }
  };
}
