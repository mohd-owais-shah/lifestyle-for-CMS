import {redirect} from 'react-router';

export const loader = () => {
  return redirect('/pages/contact', 301);
};

export default function Route() {
  return null;
}
