import { siteMetadata } from '~/data/siteMetadata'

export default function SocialAccounts() {
  return (
    <div>
      <p className="my-3">Get in touch with me via my social media accounts:</p>
      <div className="flex space-x-4">
        {siteMetadata.github && (
          <a
            href={siteMetadata.github}
            target="_blank"
            className="text-sm text-gray-500 transition hover:text-gray-600"
            data-umami-event="contact-github"
            rel="noopener noreferrer"
          >
            <span className="sr-only">Github</span>
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700 fill-current hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        )}
        {siteMetadata.linkedin && (
          <a
            href={siteMetadata.linkedin}
            target="_blank"
            className="text-sm text-gray-500 transition hover:text-gray-600"
            data-umami-event="contact-linkedin"
            rel="noopener noreferrer"
          >
            <span className="sr-only">Linkedin</span>
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700 fill-current hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        )}
        {siteMetadata.email && (
          <a
            href={`mailto:${siteMetadata.email}`}
            target="_self"
            className="text-sm text-gray-500 transition hover:text-gray-600"
            data-umami-event="contact-mail"
            rel="noopener noreferrer"
          >
            <span className="sr-only">Mail</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              className="w-6 h-6 text-gray-700 fill-current hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </a>
        )}
        {siteMetadata.linkedin && (
          <a
            href={siteMetadata.juejin}
            target="_blank"
            className="text-sm text-gray-500 transition hover:text-gray-600"
            data-umami-event="contact-mail"
            rel="noopener noreferrer"
          >
            <span className="sr-only">Mail</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 36 36"
              className="w-6 h-6 text-gray-700 fill-current hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400"
            >
              <path d="M17.5865 17.3955H17.5902L28.5163 8.77432L25.5528 6.39453L17.5902 12.6808H17.5865L17.5828 12.6845L9.62018 6.40201L6.6604 8.78181L17.5828 17.3992L17.5865 17.3955Z" />
              <path d="M17.5872 6.77268L21.823 3.40505L17.5872 0.00748237L17.5835 0L13.3552 3.39757L17.5835 6.76894L17.5872 6.77268Z" />
              <path d="M17.5865 23.2854L17.5828 23.2891L2.95977 11.7531L0 14.1291L0.284376 14.3574L17.5865 28L28.5238 19.3752L35.1768 14.1254L32.2133 11.7456L17.5865 23.2854Z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}
