import {redirect} from 'react-router';

export const loader = () => {
  return redirect('/pages/about-us', 301);
};

export default function Route() {
  return null;
}
