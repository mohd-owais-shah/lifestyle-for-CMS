import {Link} from 'react-router';
import {SectionHeading} from '~/components/small-uis/SectionHeading';

const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    url: '#',
    image:
      'https://cdn.shopify.com/s/files/1/0748/7022/7030/files/facebook23.png?v=1791370759',
  },
  {
    name: 'Twitter',
    url: '#',
    image:
      'https://cdn.shopify.com/s/files/1/0748/7022/7030/files/twitter23.png?v=1791370765',
  },
  {
    name: 'Instagram',
    url: '#',
    image:
      'https://cdn.shopify.com/s/files/1/0748/7022/7030/files/insta23.png?v=1791370771',
  },
];

export function MobileSocialPresence() {
  return (
    <div className="block lg:hidden w-full px-4 py-3 bg-white border-b-[8px] border-gray-100">
      <SectionHeading heading="Social Media Presence" />
      <div className="flex justify-around items-center pt-2 pb-1">
        {SOCIAL_LINKS.map((social) => (
          <Link
            key={social.name}
            to={social.url}
            className="block"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={social.image}
              alt={social.name}
              className="w-[120px] h-auto object-contain"
              loading="lazy"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
