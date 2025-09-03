type PathItem = {
    id: string;
    label: string;
    path: string;
};

export const convertPathToArray = (str: string): PathItem[]=> {
    const result: PathItem[] = [];
    const parts = str.split('/').filter(Boolean); // 去掉空字符串
    let currentPath = '';

    // 添加根路径
    result.push({
        id: 'root',
        label: '根路径',
        path: '/'
    });

    // 遍历路径的每一部分
    parts.forEach((part) => {
        currentPath += `/${part}`;
        result.push({
            id: part,
            label: part,
            path: currentPath
        });
    });

    return result;
}

// 测试
// const str = "/one/ab/cd/ef";
// const pathArray = convertPathToArray(str);
// console.log(pathArray);
// [
//     {
//         id: 'root',
//         label: '根路径',
//         path: '/'
//     },
//     {
//         id: 'one',
//         label: 'one',
//         path: '/one'
//     },
//     {
//         id: 'ab',
//         label: 'ab',
//         path: '/one/ab'
//     },
//     {
//         id: 'cd',
//         label: 'cd',
//         path: '/one/ab/cd'
//     },
//     {
//         id: 'ef',
//         label: 'ef',
//         path: '/one/ab/cd/ef'
//     }
// ]