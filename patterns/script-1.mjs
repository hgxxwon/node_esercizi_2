export const scriptInstance = {
    value: 0,
    output() {
        console.log(this.value++);
    },
};
