import ClientEditor from './ClientEditor';

export default function Page({ params }) {
  return <ClientEditor id={params.id} />;
}
