export const formatDate = (dataString) => {
    
    const date = new Date(dataString);
    const formattedDate = date.toLocaleDateString('en-US',{year: "numeric", month: "long", day: "numeric"});

    return formattedDate;
}