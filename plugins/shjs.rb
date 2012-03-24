# To highlight source code in an HTML document using SHJS for Jekyll
# (c) w®Ø_is…Òœ… | http://MrZhang.me | MIT Licensed.

require "cgi"

module Jekyll

  class SHJS < Liquid::Block

    def initialize(tag_name, markup, tokens)
      @lang = "js"
      if markup =~ /\s*:(\w+)/i
        @lang = $1
      end
      @lang = format_lang @lang
      super
    end

    def render(context)
      source = "<pre class='sh_#{ @lang }'>"
      code = CGI.escapeHTML super.lstrip.rstrip
      code.lines.each do |line|
        source += "<code>#{ line }</code>"
      end
      source += "</pre>"
    end

    def format_lang(lang)
      return "javascript" if lang == "js"
      return "ruby" if lang == "ru"
      lang
    end

  end

end

Liquid::Template.register_tag("sh", Jekyll::SHJS)