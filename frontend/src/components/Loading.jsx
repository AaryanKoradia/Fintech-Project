import { useLanguage } from '../context/LanguageContext';

const Loading = () => {
  const { strings } = useLanguage();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-light dark:border-primary-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl font-medium text-text-light dark:text-text-dark">{strings.loading}</p>
      </div>
    </div>
  );
};

export default Loading;
