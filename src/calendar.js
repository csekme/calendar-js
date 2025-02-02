import './calendar.css';

/**
 * Calendar component
 * @author CsK
 * @version 1.0
 * @param {Element} container - The DOM element where the calendar will be inserted.
 * @param {number} year - The year (e.g., 2025)
 * @param {number} month - The month (1 to 12)
 * @param {Array} tasks - JSON array containing task objects: {year, month, day, task}
 */
class Calendar {
    constructor(container, year, month, tasks, options) {
        this.container = container;
        this.year = year;
        this.month = month; // 1-indexed month (1-12)
        this.tasks = tasks || [];
        this.options = options || {};
        this.render();
    }

    render() {
        // Clear previous content
        this.container.innerHTML = '';

        // Create the main calendar element
        const calendarEl = document.createElement('div');
        calendarEl.classList.add('calendar');

        // Header: navigation and year–month title
        const headerEl = document.createElement('div');
        headerEl.classList.add('calendar-header');

        const prevBtn = document.createElement('button');
        prevBtn.classList.add('btn', 'btn-primary');
        prevBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
            </svg>
        `;
        prevBtn.style.paddingTop = '2px';
        prevBtn.addEventListener('click', () => this.changeMonth(-1));

        const nextBtn = document.createElement('button');
        nextBtn.classList.add('btn', 'btn-primary');
        nextBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
            </svg>
        `;
        nextBtn.style.paddingTop = '2px';
        nextBtn.addEventListener('click', () => this.changeMonth(1));

        let monthNames;
        if (this.options.monthNames) {
            monthNames = this.options.monthNames;
        } else {
            monthNames = [
                { full: 'January', short: 'Jan' },
                { full: 'February', short: 'Feb' },
                { full: 'March', short: 'Mar' },
                { full: 'April', short: 'Apr' },
                { full: 'May', short: 'May' },
                { full: 'June', short: 'Jun' },
                { full: 'July', short: 'Jul' },
                { full: 'August', short: 'Aug' },
                { full: 'September', short: 'Sep' },
                { full: 'October', short: 'Oct' },
                { full: 'November', short: 'Nov' },
                { full: 'December', short: 'Dec' }
            ];
        }

        const titleEl = document.createElement('div');
        titleEl.classList.add('calendar-title');
        titleEl.textContent = this.year + '. ' + monthNames[this.month - 1].full;
        let showButtons = true;
        if (this.options.hasOwnProperty('showButtons')) {
            showButtons = this.options.showButtons;
        }
        if (showButtons) {
            headerEl.appendChild(prevBtn);
        } else {
            headerEl.appendChild(document.createElement('div'));
        }
        headerEl.appendChild(titleEl);
        if (showButtons) {
            headerEl.appendChild(nextBtn);
        } else {
            headerEl.appendChild(document.createElement('div'));
        }
        calendarEl.appendChild(headerEl);

        // Days header: Monday to Sunday
        const daysEl = document.createElement('div');
        daysEl.classList.add('calendar-days');

        let dayNames;

        if (this.options.dayNames) {
            dayNames = this.options.dayNames;
        } else {
            dayNames = [
                { full: 'Monday', short: 'M' },
                { full: 'Tuesday', short: 'T' },
                { full: 'Wednesday', short: 'W' },
                { full: 'Thursday', short: 'Th' },
                { full: 'Friday', short: 'F' },
                { full: 'Saturday', short: 'Sa' },
                { full: 'Sunday', short: 'Su' }
            ];
        }

        dayNames.forEach(day => {
            const dayLabel = document.createElement('div');
            dayLabel.classList.add('day-label');

            // Full name span
            const fullSpan = document.createElement('span');
            fullSpan.classList.add('full-name');
            fullSpan.textContent = day.full;

            // Short name span
            const shortSpan = document.createElement('span');
            shortSpan.classList.add('short-name');
            shortSpan.textContent = day.short;

            dayLabel.appendChild(fullSpan);
            dayLabel.appendChild(shortSpan);

            daysEl.appendChild(dayLabel);
        });
        calendarEl.appendChild(daysEl);

        // Create calendar grid
        const gridEl = document.createElement('div');
        gridEl.classList.add('calendar-grid');

        // Determine the first day of the month and the number of days
        const firstDay = new Date(this.year, this.month - 1, 1);
        const totalDays = new Date(this.year, this.month, 0).getDate();

        // JavaScript getDay() returns 0 (Sunday) to 6 (Saturday).
        // Since our week starts on Monday, adjust accordingly.
        let startDay = firstDay.getDay();
        startDay = startDay === 0 ? 6 : startDay - 1;

        // Insert empty cells if the month does not start on a Monday
        for (let i = 0; i < startDay; i++) {
            const cell = document.createElement('div');
            cell.classList.add('calendar-cell', 'empty');
            gridEl.appendChild(cell);
        }

        // Create days of the month
        const self = this;
        const currentDate = new Date(); // today's date
        for (let day = 1; day <= totalDays; day++) {
            const cell = document.createElement('div');
            cell.classList.add('calendar-cell');

            // Highlight today's date
            if (
                this.year === currentDate.getFullYear() &&
                this.month === currentDate.getMonth() + 1 &&
                day === currentDate.getDate()
            ) {
                cell.classList.add('today');
            }

            const dateNumEl = document.createElement('div');
            dateNumEl.classList.add('date-number');
            dateNumEl.textContent = day;
            cell.appendChild(dateNumEl);

            const tasksEl = document.createElement('div');
            tasksEl.classList.add('tasks');

            // Filter tasks for the current day
            const dayTasks = this.tasks.filter(task => {
                return task.year === this.year && task.month === this.month && task.day === day;
            });

            // Add tasks to the cell
            if (dayTasks.length > 0) {
                dayTasks.forEach(task => {
                    const taskContainer = document.createElement('div');
                    taskContainer.classList.add('task');
                    taskContainer.classList.add('shadow');
                    if (task.color) {
                        taskContainer.style.backgroundColor = task.color + '80';
                        taskContainer.style.borderColor = task.color;
                    }

                    if (task.description) {
                        // Full version: task code + description
                        const fullTaskEl = document.createElement('span');
                        fullTaskEl.classList.add('task-full');
                        fullTaskEl.textContent = `${task.task} - ${task.description}`;

                        // Short version: only task code
                        const shortTaskEl = document.createElement('span');
                        shortTaskEl.classList.add('task-short');
                        shortTaskEl.textContent = task.task;

                        taskContainer.appendChild(fullTaskEl);
                        taskContainer.appendChild(shortTaskEl);
                    } else {
                        // If no description, display only task code
                        taskContainer.textContent = task.task;
                    }

                    // Add additional attributes to the task item
                    if (task.attributes) {
                        task.attributes.forEach(attr => {
                            taskContainer.setAttribute(attr.name, attr.value);
                        });
                    }

                    tasksEl.appendChild(taskContainer);
                });
            }

            if (dayTasks.length > 0) {
                cell.appendChild(tasksEl);
                // Show task modal on click
                cell.style.cursor = 'pointer';
                if (this.options.taskCallback) {
                    cell.addEventListener('click', function () {
                        self.options.taskCallback(self.year, self.month, day, dayTasks);
                    });
                } else {
                    cell.addEventListener('click', function () {
                        const modalBody = document.getElementById('taskModalBody');
                        modalBody.innerHTML = '';

                        dayTasks.forEach(task => {
                            const taskItem = document.createElement('div');
                            taskItem.classList.add('modal-task-item');
                            taskItem.textContent = task.description
                                ? `${task.task} - ${task.description}`
                                : task.task;
                            modalBody.appendChild(taskItem);
                        });

                        const modalLabel = document.getElementById('taskModalLabel');
                        modalLabel.textContent = `Tasks: ${self.year}. ${monthNames[self.month - 1].full} ${day}.`;

                        const modalElement = document.getElementById('taskModal');
                        const modalInstance = new bootstrap.Modal(modalElement);
                        modalInstance.show();
                    });
                }
            }

            gridEl.appendChild(cell);
        }

        calendarEl.appendChild(gridEl);
        this.container.appendChild(calendarEl);
    }

    // Set the year and re-render the calendar
    setYear(year) {
        this.year = year;
        this.render();
    }

    // Set the month and re-render the calendar
    setMonth(month) {
        if (month < 1 || month > 12) {
            throw new Error('Month must be between 1 and 12');
        }
        this.month = month;
        this.render();
    }


    // Change month (navigate)
    changeMonth(offset) {
        this.month += offset;
        if (this.month < 1) {
            this.month = 12;
            this.year--;
        } else if (this.month > 12) {
            this.month = 1;
            this.year++;
        }
        this.render();
    }
}

export default Calendar;
