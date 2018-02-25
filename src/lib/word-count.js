export default function wordCount(str) {
    // only take care of mixed {English, Number, Chinese} text

    /*
     * 1. collapse english words to reserved code point
     *
     * "single word" examples:
     *  - word
     *  - hyphen-word
     *  - someone's
     *  - 1st
     */

    let s = str

    s = s.replace(/[a-zA-Z0-9'-]+/g, '\ue000')

    /* 2. remove punctuations, spaces
     *
     * Remove English / Chinese punctuations
     */

    s = s.replace(/[~`!@#$%^&*()_+=\[\]\\{}|:;"'<>?,./-]/g, '')
         .replace(/，。《》？：；“‘【】、「」（）！¥…/g, '')
         .replace(/\s/g, '')

    /* 3. count/return Unicode glphys
     *
     * Do not use string.length, which counts UTF-16 chars
     */

    return [...s].length
}