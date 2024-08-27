import { Twemoji } from '~/components/Twemoji'
import { siteMetadata } from '~/data/siteMetadata'

export function ProfileCardInfo() {
  return (
    <div className="hidden py-4 xl:block xl:px-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
        {siteMetadata.socialAccounts.github}
      </h3>
      <h5 className="py-2 text-gray-700 dark:text-gray-400">Learner | Builder</h5>
      <div className="mt-4 mb-2 space-y-4">
        <div className="flex items-center text-gray-700 dark:text-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>

          <p className="px-2">Back-End Engineer</p>
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          <p className="px-2">
            ShangHai, China
            <span className="absolute inline-flex pt-px ml-1">
              <Twemoji emoji="flag-china" />
            </span>
          </p>
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <a className="px-2" href={`mailto:${siteMetadata.email}`}>
            {siteMetadata.email}
          </a>
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          <p className="flex space-x-1.5 px-2">
            <a
              target="_blank"
              href={siteMetadata.github}
              rel="noreferrer"
              className="hover:underline"
              data-umami-event="profile-card-github"
            >
              <svg
                height="28"
                aria-hidden="true"
                viewBox="0 0 24 24"
                version="1.1"
                width="28"
                data-view-component="true"
              >
                <path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"></path>
              </svg>
              {/* {siteMetadata.socialAccounts.github} */}
            </a>
            {/* <span className="text-gray-400 dark:text-gray-500">|</span> */}
            {/* <a
              target="_blank"
              href={siteMetadata.linkedin}
              rel="noreferrer"
              className="hover:underline"
              data-umami-event="profile-card-linkedin"
            >
              in/{siteMetadata.socialAccounts.linkedin}
            </a> */}
            {/* <span className="text-gray-400 dark:text-gray-500">|</span> */}
            {/* <a
              target="_blank"
              href={siteMetadata.juejin}
              rel="noreferrer"
              className="hover:underline"
              data-umami-event="profile-card-juejin"
            >
              juejin/{siteMetadata.socialAccounts.juejin}
            </a> */}
            {/* <span className="text-gray-400 dark:text-gray-500">|</span>
            <a
              target="_blank"
              href={siteMetadata.twitter}
              rel="noreferrer"
              className="hover:underline"
              data-umami-event="profile-card-twitter"
            >
              tw/{siteMetadata.socialAccounts.twitter}
            </a> */}
          </p>
        </div>
      </div>
    </div>
  )
}
