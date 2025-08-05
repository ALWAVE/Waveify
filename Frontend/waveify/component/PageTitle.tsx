
interface PageTitleProps {
    title: string;
 
}


const PageTitle = ({title}: PageTitleProps) => {
    return (
        <h1 className= "p-4 mb-4 text-3xl font-bold text-[var(--text)]">
            {title}
        </h1>
    );
};

export default PageTitle;